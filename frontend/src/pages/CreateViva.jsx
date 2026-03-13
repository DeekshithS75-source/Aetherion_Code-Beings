import { useState, useEffect } from "react";

export default function CreateViva() {
  const [form, setForm] = useState({
    subject: "",
    numberOfQuestions: "",
    marksPerQuestion: "",
    timeLimit: "",
  });

  const [vivas, setVivas] = useState([]);

  useEffect(() => {
    fetchVivas();
  }, []);

  const fetchVivas = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/viva/start`);
      if (res.ok) {
        const data = await res.json();
        setVivas(data);
      }
    } catch (err) {
      console.error("Error fetching vivas", err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/viva/create`,  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Viva created successfully");
      fetchVivas(); // Refresh the list
      setForm({
        subject: "",
        numberOfQuestions: "",
        marksPerQuestion: "",
        timeLimit: "",
      });
    } else {
      alert(data.message || "Error creating viva");
    }
  };

  const handleDelete = async (id, subject) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the viva for ${subject}? This will also remove it from the students' dashboard.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/viva/${id}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        setVivas(vivas.filter((viva) => viva._id !== id));
      } else {
        alert("Failed to delete viva");
      }
    } catch (err) {
      console.error(err);
      alert("Server error connecting to delete viva");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10 px-4">
      {/* Create form */}
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md mb-8">
        <h2 className="text-xl font-bold mb-4">Create Viva</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="subject"
            value={form.subject}
            placeholder="Subject"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="numberOfQuestions"
            value={form.numberOfQuestions}
            type="number"
            placeholder="Number of Questions"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="marksPerQuestion"
            value={form.marksPerQuestion}
            type="number"
            placeholder="Marks per Question"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="timeLimit"
            value={form.timeLimit}
            type="number"
            placeholder="Time Limit (minutes)"
            className="border p-2 w-full mb-4"
            onChange={handleChange}
            required
          />

          <button className="bg-blue-600 text-white w-full py-2 rounded mb-2 hover:bg-blue-700 transition">
            Create Viva
          </button>
        </form>
      </div>

      {/* List all vivas to view or delete */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Manage Active Vivas</h2>
        {vivas.length === 0 ? (
          <p className="text-gray-500 bg-white p-4 rounded-xl shadow text-center">
            No vivas currently active.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vivas.map((viva) => (
              <div
                key={viva._id}
                className="bg-white p-5 rounded-xl shadow flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {viva.subject}
                  </h3>
                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <p>Questions: {viva.numberOfQuestions}</p>
                    <p>Total Marks: {viva.totalMarks}</p>
                    <p>Time Limit: {viva.timeLimit} min</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(viva._id, viva.subject)}
                  className="mt-4 bg-red-100 text-red-600 font-semibold py-1.5 px-3 rounded hover:bg-red-200 transition text-sm w-full"
                >
                  Delete Viva
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
