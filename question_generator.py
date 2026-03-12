import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


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

    response = model.generate_content(prompt)

    text = response.text.strip()

    # remove markdown if Gemini returns it
    text = text.replace("```json", "").replace("```", "").strip()

    try:
        questions = json.loads(text)
    except json.JSONDecodeError:
        print("Raw Gemini output:")
        print(text)
        raise

    return questions