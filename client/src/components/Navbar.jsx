import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import StatusBadge from './StatusBadge';

export default function Navbar() {
  const { user, isAuthenticated, isInstructor, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
    return {
      color: isActive ? '#2563eb' : '#475569',
      backgroundColor: isActive ? '#eff6ff' : 'transparent',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: isActive ? '600' : '500',
      padding: '6px 12px',
      borderRadius: '6px',
      transition: 'all 0.15s ease'
    };
  };

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      {/* Logo & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#0f172a' }}>
          <span style={{ fontSize: '24px' }}>🎓</span>
          <span style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.3px', color: '#1e293b' }}>
            Mini <span style={{ color: '#2563eb' }}>LMS</span>
          </span>
        </Link>

        {/* Navigation Menu theo Vai trò */}
        {isAuthenticated && (
          <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
            {isInstructor ? (
              <>
                <Link to="/instructor/courses" style={getLinkStyle('/instructor/courses')}>
                  Quản lý Khóa học
                </Link>
                <Link to="/instructor/grading" style={getLinkStyle('/instructor/grading')}>
                  Chấm điểm & Bài tập
                </Link>
              </>
            ) : (
              <>
                <Link to="/student/courses" style={getLinkStyle('/student/courses')}>
                  Khóa học của tôi
                </Link>
                <Link to="/student/explore" style={getLinkStyle('/student/explore')}>
                  Khám phá Khóa học
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* User Information & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated && user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                alt={user.full_name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #e2e8f0', objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', lineHeight: 1.2 }}>
                  {user.full_name}
                </span>
                <StatusBadge type={user.role} />
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}
