import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CourseApproval from "./pages/admin/CourseApproval";
import PlatformAnalytics from "./pages/admin/PlatformAnalytics";
import SystemSettings from "./pages/admin/SystemSettings";

import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateCourse from "./pages/instructor/CreateCourse";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import EditCourse from "./pages/instructor/EditCourse";
import AssignmentManager from "./pages/instructor/AssignmentManager";
import AssignmentGrade from "./pages/instructor/AssignmentGrade";
import QuizManager from "./pages/instructor/QuizManager";
import QuizBuilder from "./pages/instructor/QuizBuilder";
import QuizAttempts from "./pages/instructor/QuizAttempts";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCoursePlayer from "./pages/student/StudentCoursePlayer"
import CourseDetails from "./pages/student/CourseDetails";
import EnrollmentPage from "./pages/student/EnrollmentPage";
import Profile from "./pages/student/Profile";
import CertificatePage from "./pages/student/CertificatePage";
import AllCourses from "./pages/student/AllCourses";

import LMSNavbar from "./components/LMSNavbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

const NavigationWrapper = () => {
  const { user, logout } = useAuth();
  return <LMSNavbar user={user} logout={logout} />;
};

const FooterWrapper = () => {
  const location = useLocation();
  const hideFooterPaths = ['/admin', '/instructor', '/student/learn'];
  const shouldHide = hideFooterPaths.some(path => location.pathname.startsWith(path));

  if (shouldHide) return null;
  return <Footer />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <NavigationWrapper />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/courses" element={<AllCourses />} />
              <Route path="/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute role="admin">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses/pending"
                element={
                  <ProtectedRoute role="admin">
                    <CourseApproval />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute role="admin">
                    <SystemSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute role="admin">
                    <PlatformAnalytics />
                  </ProtectedRoute>
                }
              />

              {/* Instructor Routes */}
              <Route
                path="/instructor/dashboard"
                element={
                  <ProtectedRoute role="instructor">
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/assignments"
                element={
                  <ProtectedRoute role="instructor">
                    <AssignmentManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/assignments/:id/grade"
                element={
                  <ProtectedRoute role="instructor">
                    <AssignmentGrade />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/quizzes"
                element={
                  <ProtectedRoute role="instructor">
                    <QuizManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/quizzes/create"
                element={
                  <ProtectedRoute role="instructor">
                    <QuizBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/quizzes/edit/:id"
                element={
                  <ProtectedRoute role="instructor">
                    <QuizBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/quizzes/:id/attempts"
                element={
                  <ProtectedRoute role="instructor">
                    <QuizAttempts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses"
                element={
                  <ProtectedRoute role="instructor">
                    <InstructorCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/create"
                element={
                  <ProtectedRoute role="instructor">
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/edit/:id"
                element={
                  <ProtectedRoute role="instructor">
                    <EditCourse />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute role="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }

              />

              <Route
                path="/student/course/:id"
                element={
                  <ProtectedRoute role="student">
                    <CourseDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student/enroll/:id"
                element={
                  <ProtectedRoute role="student">
                    <EnrollmentPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student/learn/:id"
                element={
                  <ProtectedRoute>
                    <StudentCoursePlayer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student/certificate/:id"
                element={
                  <ProtectedRoute>
                    <CertificatePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <FooterWrapper />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

