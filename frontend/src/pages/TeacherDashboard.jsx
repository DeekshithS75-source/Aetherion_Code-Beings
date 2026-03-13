import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6 animate-fade-in">
      {/* Title */}
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Teacher Dashboard
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your classes, vivas, and assignments.</p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Mark Attendance */}
        <Link
          to="/attendance"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up delay-100 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📝</div>
          <h2 className="text-xl font-bold text-gray-800">Mark Attendance</h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Take roll call manually</p>
        </Link>

        {/* View Attendance */}
        <Link
          to="/teacher-attendance-view"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up delay-200 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📅</div>
          <h2 className="text-xl font-bold text-gray-800">View Attendance</h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Access database log</p>
        </Link>

        {/* Add Student */}
        <Link
          to="/add-student"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up delay-300 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">➕</div>
          <h2 className="text-xl font-bold text-gray-800">Add Student</h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Register new students</p>
        </Link>

        {/* Assignments */}
        <Link
          to="/assignments"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up delay-400 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📝</div>
          <h2 className="text-xl font-bold text-gray-800">Assignments</h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Create AI grading tasks</p>
        </Link>

        {/* AI Viva */}
        <Link
          to="/create-viva"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up delay-500 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎤</div>
          <h2 className="text-xl font-bold text-gray-800">AI Viva</h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Conduct oral exams</p>
        </Link>
      </div>
    </div>
  );
}
