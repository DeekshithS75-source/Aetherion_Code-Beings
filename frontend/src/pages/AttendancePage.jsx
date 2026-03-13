import { useState } from "react";

const EVENT_TYPES = ["Class", "Lab", "Workshop", "Bootcamp", "Seminar"];

export default function AttendancePage() {
  const [form, setForm] = useState({
    className: "",
    date: "",
    time: "",
    absentees: "",
  });

  const [eventType, setEventType] = useState("Class");

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
          eventType,
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

          {/* Event type pills */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Event Type</p>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${eventType === type
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

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
