import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usn: "",
    password: "",
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
        "${import.meta.env.VITE_API_URL}/api/auth/student-login",
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
        console.log("Login success:", data);

        // optionally store student data
        localStorage.setItem("student", JSON.stringify(data));
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);

        navigate("/student-dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Cannot connect to backend server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-xl font-bold mb-6 text-center">Student Login</h2>

        <form onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
