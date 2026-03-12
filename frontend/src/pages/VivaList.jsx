import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VivaList() {
  const [vivas, setVivas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/viva/ongoing")
      .then((res) => res.json())
      .then((data) => setVivas(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-2xl font-bold mb-6">Available Vivas</h1>

      <div className="grid grid-cols-2 gap-6">
        {vivas.map((viva, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{viva.subject}</h2>

            <p>Questions: {viva.numberOfQuestions}</p>
            <p>Marks: {viva.marksPerQuestion}</p>
            <p>Time: {viva.timeLimit} minutes</p>

            <button
              onClick={() => navigate(`/viva/${viva.subject}`)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Start Viva
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
