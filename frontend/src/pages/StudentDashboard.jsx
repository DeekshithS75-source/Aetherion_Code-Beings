import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6 animate-fade-in">
      {/* Title */}
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600">
          Student Dashboard
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Your academic companion hub.</p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Attendance */}
        <Link
          to="/student-attendance"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up delay-100 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📅</div>
          <span className="bg-green-100 text-green-700 font-bold px-4 py-1.5 rounded-full mt-2">
            View Attendance
          </span>
        </Link>

        {/* Assignments */}
        <Link
          to="/student-assignments"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up delay-200 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📝</div>
          <span className="bg-green-100 text-green-700 font-bold px-4 py-1.5 rounded-full mt-2">
            Assignments
          </span>
        </Link>

        {/* Viva */}
        <Link
          to="/vivas"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up delay-300 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎤</div>
          <span className="bg-green-100 text-green-700 font-bold px-4 py-1.5 rounded-full mt-2">
            Take Viva Exam
          </span>
        </Link>

        {/* Study Materials */}
        <Link
          to="/notes"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up delay-400 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📚</div>
          <span className="bg-green-100 text-green-700 font-bold px-4 py-1.5 rounded-full mt-2">
            Study Materials
          </span>
        </Link>
      </div>
    </div>
  );
}
