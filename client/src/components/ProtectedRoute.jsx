import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Component bảo vệ các Route yêu cầu xác thực hoặc phân quyền vai trò (Role)
 * @param {Array<string>} allowedRoles - Danh sách vai trò được truy cập (ví dụ: ['INSTRUCTOR'] hoặc ['STUDENT'])
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
        <div className="spinner"></div>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // Điều hướng người dùng về đúng khu vực vai trò của họ nếu không có quyền
    const fallbackPath = user?.role === 'INSTRUCTOR' ? '/instructor/courses' : '/student/courses';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
