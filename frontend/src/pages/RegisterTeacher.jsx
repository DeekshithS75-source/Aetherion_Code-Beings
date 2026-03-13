import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterTeacher() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
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
      const res = await fetch(
        "${import.meta.env.VITE_API_URL}/api/auth/teacher-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful");
        navigate("/teacher-login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-xl font-bold mb-6 text-center">
          Teacher Registration
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="name"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="email"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="password"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="department"
            type="text"
            placeholder="department"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
