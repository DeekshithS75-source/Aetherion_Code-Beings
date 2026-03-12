import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        EduSphere Teacher Dashboard
      </h1>

      {/* Cards Container */}
      <div className="flex flex-col gap-8 w-full max-w-md">
        {/* Attendance */}
        <Link
          to="/attendance"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-xl font-semibold">Attendance</h2>
          <p className="text-gray-500 text-sm mt-2">Mark student attendance</p>
        </Link>

        {/* Add Student */}
        <Link
          to="/add-student"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">➕</div>
          <h2 className="text-xl font-semibold">Add Student</h2>
          <p className="text-gray-500 text-sm mt-2">Register new students</p>
        </Link>

        {/* Students */}
        <Link
          to="/student-management"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-semibold">Students</h2>
          <p className="text-gray-500 text-sm mt-2">Manage student records</p>
        </Link>

        {/* Assignments */}
        <Link
          to="/assignments"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-semibold">Assignments</h2>
          <p className="text-gray-500 text-sm mt-2">Create assignments</p>
        </Link>

        {/* AI Viva */}
        <Link
          to="/create-viva"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">🎤</div>
          <h2 className="text-xl font-semibold">AI Viva</h2>
          <p className="text-gray-500 text-sm mt-2">Conduct viva exams</p>
        </Link>

        {/* Study Materials */}
        <Link
          to="/materials"
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl font-semibold">Study Materials</h2>
          <p className="text-gray-500 text-sm mt-2">Upload notes</p>
        </Link>
      </div>
    </div>
  );
}
