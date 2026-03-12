import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-600 mb-10">
        Student Dashboard
      </h1>

      {/* Cards Container */}
      <div className="flex flex-col gap-8 w-full max-w-md">
        {/* Attendance */}
        <Link
          to="/student-attendance"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">📅</div>
          <span className="bg-blue-500 text-white px-4 py-1 rounded-md">
            Attendance
          </span>
        </Link>

        {/* Assignments */}
        <Link
          to="/student-assignments"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">📝</div>
          <span className="bg-blue-500 text-white px-4 py-1 rounded-md">
            Assignments
          </span>
        </Link>

        {/* Viva */}
        <Link
          to="/vivas"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">🎤</div>
          <span className="bg-blue-500 text-white px-4 py-1 rounded-md">
            Viva
          </span>
        </Link>

        {/* Study Materials */}
        <Link
          to="/notes"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">📚</div>
          <span className="bg-blue-500 text-white px-4 py-1 rounded-md">
            Study Materials
          </span>
        </Link>
      </div>
    </div>
  );
}
