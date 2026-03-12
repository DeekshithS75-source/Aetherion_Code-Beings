import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    usn: "",
    password: "",
    parentEmail: "",
    parentPhone: "",
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
      const res = await fetch("http://localhost:5000/api/auth/add-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Student added successfully");
        navigate("/teacher-dashboard");
      } else {
        alert(data.message || "Failed to add student");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Add Student</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Student Name"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="usn"
            placeholder="USN"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="parentEmail"
            type="email"
            placeholder="Parent Email"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="parentPhone"
            placeholder="Parent Phone Number"
            className="w-full border p-2 rounded mb-6"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
}
