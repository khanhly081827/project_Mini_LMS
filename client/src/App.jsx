import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './features/auth/Login';
import InstructorCourses from './features/courses/InstructorCourses';
import StudentCourses from './features/courses/StudentCourses';
import './App.css';

// Component điều hướng trang chủ dựa trên trạng thái đăng nhập và vai trò
function HomeRedirect() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'INSTRUCTOR' ? (
    <Navigate to="/instructor/courses" replace />
  ) : (
    <Navigate to="/student/courses" replace />
  );
}

// Bố cục chính kèm thanh điều hướng Navbar
function MainLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Màn hình Đăng nhập (UI01) */}
          <Route path="/login" element={<Login />} />

          {/* Điều hướng trang gốc */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Khu vực Giảng viên (Protected - Role: INSTRUCTOR) */}
          <Route
            path="/instructor/*"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <MainLayout>
                  <Routes>
                    <Route path="courses" element={<InstructorCourses />} />
                    <Route path="*" element={<Navigate to="/instructor/courses" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Khu vực Sinh viên (Protected - Role: STUDENT) */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <MainLayout>
                  <Routes>
                    <Route path="courses" element={<StudentCourses />} />
                    <Route path="*" element={<Navigate to="/student/courses" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Bắt các đường dẫn không hợp lệ */}
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
