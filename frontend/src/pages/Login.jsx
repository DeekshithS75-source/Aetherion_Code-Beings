import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Welcome to <span className="text-gradient">EduSphere</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-lg mx-auto">
          The all-in-one AI powered platform for teachers and students.
        </p>
      </div>

      <div className="flex gap-8 max-w-4xl w-full justify-center flex-wrap">
        {/* Teacher Login Card */}
        <Link
          to="/teacher-login"
          className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 p-10 flex flex-col items-center flex-1 min-w-[300px] animate-slide-up delay-100 group"
        >
          <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">👨‍🏫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Teacher</h2>
          <p className="text-gray-500 text-center">
            Login to manage classes, take vivas, and grade assignments.
          </p>
          <div className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 rounded-full font-semibold group-hover:bg-blue-600 group-hover:text-white transition">
            Continue as Teacher &rarr;
          </div>
        </Link>

        {/* Student Login Card */}
        <Link
          to="/student-login"
          className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 p-10 flex flex-col items-center flex-1 min-w-[300px] animate-slide-up delay-200 group"
        >
          <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">👨‍🎓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Student</h2>
          <p className="text-gray-500 text-center">
            Login to take vivas, view your attendance, and upload assignments.
          </p>
          <div className="mt-6 px-6 py-2 bg-green-50 text-green-600 rounded-full font-semibold group-hover:bg-green-600 group-hover:text-white transition">
            Continue as Student &rarr;
          </div>
        </Link>
      </div>
    </div>
  );
}
