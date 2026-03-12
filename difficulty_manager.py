def get_next_difficulty(current_difficulty, marks_awarded, max_marks):

    threshold = max_marks / 2

    if marks_awarded > threshold:
        return min(current_difficulty + 1, 5)

    else:
        return max(current_difficulty - 1, 1)