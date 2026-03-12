import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";
import RegisterTeacher from "./pages/RegisterTeacher";
import TeacherDashboard from "./pages/TeacherDashboard";
import AddStudent from "./pages/AddStudent";
import StudentDashboard from "./pages/StudentDashboard";
import AttendancePage from "./pages/AttendancePage";
import VivaList from "./pages/VivaList";
import VivaPage from "./pages/VivaPage";
import CreateViva from "./pages/CreateViva";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/register-teacher" element={<RegisterTeacher />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/vivas" element={<VivaList />} />
        <Route path="/viva/:subject" element={<VivaPage />} />
        <Route path="/create-viva" element={<CreateViva />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
