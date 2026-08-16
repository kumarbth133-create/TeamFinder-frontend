import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute, { AdminRoute } from "./utils/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminLogin from "./pages/auth/AdminLogin";

// Student Pages
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import Students from "./pages/student/Students";
import StudentDetail from "./pages/student/StudentDetail";
import Mentors from "./pages/student/Mentors";
import MentorDetail from "./pages/student/MentorDetail";
import Courses from "./pages/student/Courses";
import CourseDetail from "./pages/student/CourseDetail";
import Projects from "./pages/student/Projects";
import ProjectDetail from "./pages/student/ProjectDetail";
import CreateProject from "./pages/student/CreateProject";
import EditProject from "./pages/student/EditProject";
import MyProjects from "./pages/student/MyProjects";
import MyRequests from "./pages/student/MyRequests";
import Notifications from "./pages/student/Notifications";
import GameZone from "./pages/student/GameZone";
import TicTacToe from "./pages/student/games/TicTacToe";
import SnakeGame from "./pages/student/games/SnakeGame";
import MemoryGame from "./pages/student/games/MemoryGame";
import TypingRace from "./pages/student/games/TypingRace";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminProjects from "./pages/admin/AdminProjects";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Student Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/students/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
        <Route path="/mentors" element={<ProtectedRoute><Mentors /></ProtectedRoute>} />
        <Route path="/mentors/:id" element={<ProtectedRoute><MentorDetail /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
        <Route path="/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
        <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/game-zone" element={<ProtectedRoute><GameZone /></ProtectedRoute>} />
        <Route path="/game-zone/tic-tac-toe" element={<ProtectedRoute><TicTacToe /></ProtectedRoute>} />
        <Route path="/game-zone/snake" element={<ProtectedRoute><SnakeGame /></ProtectedRoute>} />
        <Route path="/game-zone/memory" element={<ProtectedRoute><MemoryGame /></ProtectedRoute>} />
        <Route path="/game-zone/typing-race" element={<ProtectedRoute><TypingRace /></ProtectedRoute>} />



        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/students" element={<AdminRoute><AdminStudents /></AdminRoute>} />
        <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-200">404</h1>
              <p className="text-gray-500 mt-2">Page not found</p>
              <a href="/login" className="mt-4 inline-block text-primary-600 hover:underline">Go to Login</a>
            </div>
          </div>
        } />
      </Routes>
    </AuthProvider>
  </ThemeProvider>
);
};

export default App;
