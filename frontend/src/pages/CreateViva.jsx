import { useState } from "react";

export default function CreateViva() {
  const [form, setForm] = useState({
    subject: "",
    numberOfQuestions: "",
    marksPerQuestion: "",
    timeLimit: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/viva/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Viva created successfully");
    } else {
      alert(data.message || "Error creating viva");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-xl font-bold mb-4">Create Viva</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="subject"
            placeholder="Subject"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="numberOfQuestions"
            type="number"
            placeholder="Number of Questions"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="marksPerQuestion"
            type="number"
            placeholder="Marks per Question"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="timeLimit"
            type="number"
            placeholder="Time Limit (minutes)"
            className="border p-2 w-full mb-4"
            onChange={handleChange}
            required
          />

          <button className="bg-blue-600 text-white w-full py-2 rounded">
            Create Viva
          </button>
        </form>
      </div>
    </div>
  );
}
