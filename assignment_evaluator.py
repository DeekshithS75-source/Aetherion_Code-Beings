import json
from google import genai
from dotenv import load_dotenv
import os
import mimetypes
import base64
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from groq import Groq

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
groq_api_key = os.getenv("GROQ_API_KEY")

client = genai.Client(api_key=api_key) if api_key else None
groq_client = Groq(api_key=groq_api_key) if groq_api_key else None

# Models
MODEL = "gemini-2.0-flash" 
GROQ_VISION_MODEL = "llama-3.2-90b-vision-preview"
TIMEOUT_SECONDS = 30

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def evaluate_assignment_image(image_path: str, max_marks: int, title: str, description: str):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at path: {image_path}")

    mime_type, _ = mimetypes.guess_type(image_path)
    if not mime_type:
        mime_type = "image/jpeg"
        
    prompt = f"""
You are an expert teacher grading a student's assignment submission.
The student has submitted an image containing their answer.

Assignment Title: {title}
Assignment Description: {description}
Maximum Marks: {max_marks}

Your tasks:
1. Carefully extract the text from the student's submitted image.
2. First, determine what the correct answer should be for this assignment. 
3. Compare the student's answer to your expected answer. Evaluate the accuracy and completeness based on the assignment description.
4. Grade the answer from 0 to {max_marks} based purely on the content correctnes. Use an integer value.
5. Provide concise, constructive feedback explaining why you gave this grade.
6. ANTI-CHEAT DETECTION: Analyze the handwriting/font in the image. Determine if this looks like genuine messy human handwriting/photo, OR if it looks like AI-generated text printed out with a fake handwriting font or a perfectly typed document. Set "is_ai_generated" to true ONLY if you strongly suspect it is a typed document or perfectly uniform fake handwriting font.

You must return ONLY a raw JSON object with the following schema, and absolutely no markdown formatting, no code blocks, and no extra text:
{{
  "original_score": (integer),
  "feedback": "(string)",
  "is_ai_generated": (boolean)
}}
"""

    def call_gemini():
        if not client:
            raise ValueError("Gemini client not initialized")
        uploaded_file = client.files.upload(file=image_path, config={'mime_type': mime_type})
        response = client.models.generate_content(
            model=MODEL,
            contents=[
                uploaded_file,
                prompt
            ]
        )
        return response.text

    def call_groq():
        if not groq_client:
            raise ValueError("Groq client not initialized")
        base64_image = encode_image(image_path)
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            model=GROQ_VISION_MODEL,
        )
        return chat_completion.choices[0].message.content

    text = None
    
    # Try Gemini first
    if client:
        try:
            with ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(call_gemini)
                try:
                    text = future.result(timeout=TIMEOUT_SECONDS)
                except FuturesTimeoutError:
                    print("[WARN] Gemini API timed out, falling back to Groq")
        except Exception as e:
            print(f"[WARN] Gemini API call failed: {str(e)}, falling back to Groq")

    # Fallback to Groq if Gemini failed or wasn't initialized
    if not text and groq_client:
        try:
            with ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(call_groq)
                try:
                    text = future.result(timeout=TIMEOUT_SECONDS)
                except FuturesTimeoutError:
                     raise TimeoutError(f"Groq API did not respond within {TIMEOUT_SECONDS} seconds")
        except TimeoutError:
             raise
        except Exception as e:
            raise RuntimeError(f"Groq API fallback failed: {str(e)}")
            
    if not text:
        raise RuntimeError("Both Gemini and Groq APIs failed or are not configured.")

    text = text.strip()
    
    # remove markdown if LLM still returns it
    text = text.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(text)
        
        # Calculate final score with 40% deduction if AI generated
        original_score = result.get("original_score", 0)
        is_ai = result.get("is_ai_generated", False)
        
        if is_ai:
            final_score = int(original_score * 0.6) # Deduct 40%
            result["score"] = final_score
            result["feedback"] = f"⚠️ 40% PENALTY APPLIED FOR AI-GENERATED UPLOAD.\n\n" + result.get("feedback", "")
        else:
            result["score"] = original_score
            
    except json.JSONDecodeError:
        print("Raw model output expected JSON but got:")
        print(text)
        raise RuntimeError(f"Failed to parse Gemini/Groq evaluation response. Error: Invalid JSON received")

    return result
