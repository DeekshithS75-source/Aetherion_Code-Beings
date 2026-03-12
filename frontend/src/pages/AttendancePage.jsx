import { useState } from "react";

export default function AttendancePage() {
  const [form, setForm] = useState({
    className: "",
    classType: "normal",
    date: "",
    time: "",
    absentees: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const absenteesArray = form.absentees.split(",").map((a) => a.trim());

      const res = await fetch("http://localhost:5000/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          className: form.className,
          classType: form.classType,
          date: form.date,
          time: form.time,
          absentees: absenteesArray,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Attendance submitted successfully");
      } else {
        alert(data.message || "Attendance failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-10">Mark Attendance</h1>

      <div className="bg-white shadow rounded-xl p-8 mt-8 w-96">
        <form onSubmit={handleSubmit}>
          <input
            name="className"
            placeholder="Class Name"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <select
            name="classType"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
          >
            <option value="normal">Normal Class</option>
            <option value="workshop">Workshop</option>
            <option value="bootcamp">Bootcamp</option>
          </select>

          <input
            name="date"
            type="date"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="time"
            type="time"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="absentees"
            placeholder="Absent students (last 2 digits e.g. 01,05)"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Attendance
          </button>
        </form>
      </div>
    </div>
  );
}
