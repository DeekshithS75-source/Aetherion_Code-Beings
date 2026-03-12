import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function VivaPage() {
  const { subject } = useParams();

  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/viva/${subject}`)
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  const submitAnswer = () => {
    if (selected === question.correct_answer) {
      setScore(score + question.marks);
    }

    nextQuestion();
  };

  const nextQuestion = () => {
    fetch("http://localhost:8000/generate_question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: subject,
      }),
    })
      .then((res) => res.json())
      .then((data) => setQuestion(data));
  };

  if (!question) return <div>Loading question...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-lg font-bold mb-4">{question.question}</h2>

        {question.options.map((opt, index) => (
          <div key={index} className="mb-2">
            <label>
              <input
                type="radio"
                name="answer"
                value={opt}
                onChange={(e) => setSelected(e.target.value)}
              />

              {opt}
            </label>
          </div>
        ))}

        <button
          onClick={submitAnswer}
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
        >
          Submit
        </button>

        <p className="mt-4">Score: {score}</p>
      </div>
    </div>
  );
}
