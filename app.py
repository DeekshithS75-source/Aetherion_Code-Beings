from flask import Flask, request, jsonify

from question_generator import generate_questions
from mcq_evaluator import evaluate_mcq
from difficulty_manager import get_next_difficulty

app = Flask(__name__)


@app.route("/generate-question", methods=["POST"])
def generate_question():

    data = request.json

    topic = data["topic"]
    difficulty = data["difficulty"]

    questions = generate_questions(topic, 1, 2, difficulty)

    return jsonify(questions[0])


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)