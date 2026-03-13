from question_generator import generate_questions
from mcq_evaluator import evaluate_mcq
from difficulty_manager import get_next_difficulty

questions = generate_questions("General Knowledge", 5, 6, 3)

difficulty = 3

for q in questions:

    print("\nQuestion:", q["question"])

    for i, option in enumerate(q["options"]):
        print(f"{i+1}. {option}")

    answer = int(input("Enter option number: "))

    student_answer = q["options"][answer-1]

    result = evaluate_mcq(
        q["correct_answer"],
        student_answer,
        q["marks"]
    )

    print(result)

    difficulty = get_next_difficulty(
        difficulty,
        result["marks_awarded"],
        result["max_marks"]
    )

    print("Next difficulty:", difficulty)