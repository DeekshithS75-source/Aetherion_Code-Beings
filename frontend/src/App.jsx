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
import TeacherAssignments from "./pages/TeacherAssignments";
import StudentAssignments from "./pages/StudentAssignments";
import TeacherAttendanceView from "./pages/TeacherAttendanceView";
import StudentAttendance from "./pages/StudentAttendance";

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
        <Route path="/teacher-attendance-view" element={<TeacherAttendanceView />} />
        <Route path="/student-attendance" element={<StudentAttendance />} />
        <Route path="/vivas" element={<VivaList />} />
        <Route path="/viva/:subject" element={<VivaPage />} />
        <Route path="/create-viva" element={<CreateViva />} />
        <Route path="/assignments" element={<TeacherAssignments />} />
        <Route path="/student-assignments" element={<StudentAssignments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
