def evaluate_mcq(correct_answer, student_answer, marks):

    if student_answer.strip().lower() == correct_answer.strip().lower():

        return {
            "marks_awarded": marks,
            "max_marks": marks,
            "feedback": "Correct answer"
        }

    else:

        return {
            "marks_awarded": 0,
            "max_marks": marks,
            "feedback": "Incorrect answer"
        }