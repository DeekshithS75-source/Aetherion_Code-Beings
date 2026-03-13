from flask import Flask, request, jsonify
from flask_cors import CORS

from question_generator import generate_questions
from mcq_evaluator import evaluate_mcq
from difficulty_manager import get_next_difficulty

app = Flask(__name__)
CORS(app)


@app.route("/generate-question", methods=["POST"])
def generate_question():

    data = request.json

    topic = data.get("topic")
    difficulty = data.get("difficulty", 2)

    if not topic:
        return jsonify({"error": "topic is required"}), 400

    try:
        questions = generate_questions(topic, 1, 2, difficulty)
        return jsonify(questions[0])
    except TimeoutError as e:
        return jsonify({"error": "Gemini API timed out", "detail": str(e)}), 504
    except Exception as e:
        return jsonify({"error": "Failed to generate question", "detail": str(e)}), 500


@app.route("/evaluate-mcq", methods=["POST"])
def evaluate():

    data = request.json

    correct_answer = data["correct_answer"]
    student_answer = data["student_answer"]
    marks = data["marks"]
    difficulty = data["difficulty"]

    result = evaluate_mcq(correct_answer, student_answer, marks)

    next_difficulty = get_next_difficulty(
        difficulty,
        result["marks_awarded"],
        result["max_marks"]
    )

    result["next_difficulty"] = next_difficulty

    return jsonify(result)

from assignment_evaluator import evaluate_assignment_image

@app.route("/evaluate-assignment", methods=["POST"])
def evaluate_assignment():
    data = request.json
    
    image_path = data.get("image_path")
    max_marks = data.get("max_marks")
    title = data.get("assignment_title")
    description = data.get("assignment_description")
    
    if not all([image_path, max_marks, title, description]):
        return jsonify({"error": "Missing required fields for evaluation"}), 400
        
    try:
        evaluation = evaluate_assignment_image(
            image_path=image_path,
            max_marks=max_marks,
            title=title,
            description=description
        )
        return jsonify(evaluation)
    except Exception as e:
        print(f"Error evaluating assignment: {e}")
        return jsonify({"error": str(e)}), 500


import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
