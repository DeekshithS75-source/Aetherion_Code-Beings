from google import genai
import json
import os
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from groq import Groq

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
groq_api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("[ERROR] GEMINI_API_KEY is not set in .env")
else:
    print(f"[OK] GEMINI_API_KEY loaded (starts with: {api_key[:8]}...)")

if not groq_api_key:
    print("[ERROR] GROQ_API_KEY is not set in .env")
else:
    print(f"[OK] GROQ_API_KEY loaded (starts with: {groq_api_key[:8]}...)")

client = genai.Client(api_key=api_key) if api_key else None
groq_client = Groq(api_key=groq_api_key) if groq_api_key else None

MODEL = "gemini-2.0-flash"
GROQ_MODEL = "llama-3.3-70b-versatile" # Great fallback model for Groq

TIMEOUT_SECONDS = 30


def generate_questions(topic: str, count: int, total_marks: int, difficulty: int):

    marks_per_question = total_marks // count

    prompt = f"""
Generate {count} MCQ viva questions about the topic: {topic}.

All questions MUST have difficulty level: {difficulty}
Difficulty scale:
1 = very easy
2 = easy
3 = medium
4 = hard
5 = very hard

Rules:
- Each question must have exactly 4 options
- Only ONE correct answer
- marks per question = {marks_per_question}

Return ONLY JSON array.

Format:

[
{{
"id": 1,
"question": "Question text",
"difficulty": {difficulty},
"options": [
"Option A",
"Option B",
"Option C",
"Option D"
],
"correct_answer": "Option A",
"marks": {marks_per_question}
}}
]
"""

    def call_gemini():
        if not client:
            raise ValueError("Gemini client not initialized")
        return client.models.generate_content(model=MODEL, contents=prompt).text
        
    def call_groq():
        if not groq_client:
            raise ValueError("Groq client not initialized")
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=GROQ_MODEL,
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

    # remove markdown if LLM returns it
    text = text.replace("```json", "").replace("```", "").strip()

    try:
        questions = json.loads(text)
    except json.JSONDecodeError:
        print("Raw model output:")
        print(text)
        raise

    return questions