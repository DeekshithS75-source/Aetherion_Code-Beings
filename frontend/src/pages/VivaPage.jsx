import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function VivaPage() {
  const { subject } = useParams();
  const navigate = useNavigate();

  // Viva config (from Node API)
  const [vivaConfig, setVivaConfig] = useState(null);

  // Question state
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [highestDifficulty, setHighestDifficulty] = useState(2);
  const [currentDifficulty, setCurrentDifficulty] = useState(2);

  // Progress
  const [questionNumber, setQuestionNumber] = useState(0);

  // Completion
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  // Anti-Cheat (Tab Switching)
  const [showWarning, setShowWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  // ── 1. Fetch viva config on mount ─────────────────────────────────────────
  useEffect(() => {
    fetch(`http://localhost:5000/api/viva/${subject}`)
      .then((res) => res.json())
      .then((data) => {
        setVivaConfig(data);
        setTimeLeft(data.timeLimit * 60); // convert minutes → seconds
      })
      .catch(() => {
        // If config fetch fails fall back to a safe default
        setVivaConfig({ numberOfQuestions: 5, totalMarks: 10, timeLimit: 10, _id: null });
        setTimeLeft(10 * 60);
      });
  }, [subject]);

  // ── 2. Start first question once config is loaded ─────────────────────────
  useEffect(() => {
    if (vivaConfig) {
      nextQuestion();
    }
  }, [vivaConfig]);

  // ── 3. Start countdown timer once timeLeft is initialised ─────────────────
  useEffect(() => {
    if (timeLeft === null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleComplete(score, highestDifficulty, true); // auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft === null]); // only re-run when we go from null → number

  // ── 4. Anti-Cheat: Tab Switching Listener ─────────────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isCompleted && question) {
        setShowWarning(true);
        setWarningCount((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isCompleted, question]);

  // ── 5. Anti-Cheat: Disable Context Menu, Copy, Paste, Drag ────────────────
  useEffect(() => {
    if (isCompleted) return; // Allow these actions once completed

    const preventAction = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", preventAction);
    document.addEventListener("copy", preventAction);
    document.addEventListener("cut", preventAction);
    document.addEventListener("paste", preventAction);
    document.addEventListener("selectstart", preventAction);
    document.addEventListener("dragstart", preventAction);

    return () => {
      document.removeEventListener("contextmenu", preventAction);
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("cut", preventAction);
      document.removeEventListener("paste", preventAction);
      document.removeEventListener("selectstart", preventAction);
      document.removeEventListener("dragstart", preventAction);
    };
  }, [isCompleted]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const nextQuestion = () => {
    fetch("http://localhost:8000/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: subject, difficulty: currentDifficulty }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Question generation error:", data.detail);
          return;
        }
        setQuestion(data);
        setSelected("");
        setQuestionNumber((n) => n + 1);
      });
  };

  const handleComplete = (finalScore, finalDifficulty, fromTimer = false) => {
    clearInterval(timerRef.current);
    setIsCompleted(true);

    // Save result to MongoDB
    const studentId = localStorage.getItem("userId");
    const vivaId = vivaConfig?._id;

    fetch("http://localhost:5000/api/viva/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        vivaId,
        score: finalScore,
        maxScore: vivaConfig?.totalMarks ?? 0,
        highestDifficulty: finalDifficulty,
      }),
    })
      .then((res) => res.json())
      .then(() => setResultSaved(true))
      .catch(() => setResultSaved(true)); // don't block UI if save fails
  };

  const submitAnswer = () => {
    let newScore = score;
    let newDifficulty = currentDifficulty;

    if (selected === question.correct_answer) {
      newScore = score + question.marks;
      setScore(newScore);
    }

    // Evaluate via Flask to get next difficulty
    fetch("http://localhost:8000/evaluate-mcq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correct_answer: question.correct_answer,
        student_answer: selected || "",
        marks: question.marks,
        difficulty: currentDifficulty,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        newDifficulty = result.next_difficulty ?? currentDifficulty;
        setCurrentDifficulty(newDifficulty);
        setHighestDifficulty((prev) => Math.max(prev, newDifficulty));

        const total = vivaConfig?.numberOfQuestions ?? 5;
        if (questionNumber >= total) {
          handleComplete(newScore, Math.max(highestDifficulty, newDifficulty));
        } else {
          nextQuestion();
        }
      })
      .catch(() => {
        // If evaluate fails, still progress
        const total = vivaConfig?.numberOfQuestions ?? 5;
        if (questionNumber >= total) {
          handleComplete(newScore, highestDifficulty);
        } else {
          nextQuestion();
        }
      });
  };

  // ── Completion screen ─────────────────────────────────────────────────────
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-10 rounded-xl shadow w-96 text-center">
          <h2 className="text-2xl font-bold mb-6 text-green-600">Viva Complete! 🎉</h2>

          <div className="mb-4">
            <p className="text-gray-500 text-sm">Score</p>
            <p className="text-4xl font-bold text-blue-600">
              {score} <span className="text-xl text-gray-400">/ {vivaConfig?.totalMarks ?? "?"}</span>
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-500 text-sm">Highest Difficulty Reached</p>
            <p className="text-2xl font-bold text-purple-600">{highestDifficulty} / 5</p>
          </div>

          {!resultSaved && (
            <p className="text-xs text-gray-400 mb-4">Saving results...</p>
          )}

          <button
            onClick={() => navigate("/student-dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Loading screen ────────────────────────────────────────────────────────
  if (!question) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-gray-500">Loading question...</p>
      </div>
    );
  }

  const total = vivaConfig?.numberOfQuestions ?? "?";

  // ── Main viva UI ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center relative select-none">

      {/* Anti-Cheat Warning Modal Overlay */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[28rem] text-center transform scale-100 animate-pulse-fast">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Warning!</h2>
            <p className="text-gray-700 mb-4 font-medium">
              You switched tabs or left the exam window. This action is recorded.
            </p>
            <p className="text-xs text-gray-500 mb-6 font-bold uppercase tracking-wider">
              Violations so far: <span className="text-red-600">{warningCount}</span>
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="bg-red-600 text-white font-bold px-6 py-2 rounded shadow hover:bg-red-700 hover:-translate-y-0.5 transition w-full"
            >
              I Understand, Return to Exam
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow w-[28rem]">

        {/* Header row: progress + timer */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-500">
            Question {questionNumber} of {total}
          </span>
          {timeLeft !== null && (
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${timeLeft <= 60
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-600"
                }`}
            >
              ⏱ {formatTime(timeLeft)}
            </span>
          )}
        </div>

        {/* Difficulty badge */}
        <p className="text-xs text-purple-500 mb-2 font-medium">
          Difficulty: {question.difficulty} / 5
        </p>

        {/* Question text */}
        <h2 className="text-lg font-bold mb-4">{question.question}</h2>

        {/* Options */}
        {question.options.map((opt, index) => (
          <div key={index} className="mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={selected === opt}
                onChange={(e) => setSelected(e.target.value)}
              />
              {opt}
            </label>
          </div>
        ))}

        {/* Submit */}
        <button
          onClick={submitAnswer}
          disabled={!selected}
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          Submit Answer
        </button>

        {/* Score */}
        <p className="mt-4 text-sm text-gray-500">
          Score so far: <span className="font-bold text-gray-800">{score}</span>
        </p>
      </div>
    </div>
  );
}
