import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra nếu có query param session_expired
  const searchParams = new URLSearchParams(location.search);
  const sessionExpired = searchParams.get('session_expired') === 'true';

  // Nếu đã đăng nhập, tự động chuyển hướng theo Role
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = location.state?.from?.pathname || (user.role === 'INSTRUCTOR' ? '/instructor/courses' : '/student/courses');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email');
      return;
    }

    if (!password) {
      setErrorMsg('Vui lòng nhập mật khẩu');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await login(email.trim(), password);
      // Chuyển hướng theo vai trò (Role-based redirection)
      if (result.user.role === 'INSTRUCTOR') {
        navigate('/instructor/courses', { replace: true });
      } else {
        navigate('/student/courses', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm điền nhanh tài khoản mẫu để test phân quyền (FR01 / UI01)
  const handleQuickFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('123456');
    setErrorMsg('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h1 className="login-title">Đăng nhập Mini LMS</h1>
          <p className="login-subtitle">Hệ thống Quản lý Học tập Trực tuyến</p>
        </div>

        {/* Thông báo phiên hết hạn */}
        {sessionExpired && !errorMsg && (
          <div className="login-alert login-alert-info">
            <span>ℹ️</span>
            <span>Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.</span>
          </div>
        )}

        {/* Thông báo lỗi */}
        {errorMsg && (
          <div className="login-alert login-alert-error">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Đăng nhập */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="nguyenvana@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Ghi nhớ đăng nhập
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Vui lòng liên hệ Quản trị viên để đặt lại mật khẩu.'); }} className="forgot-link">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner-small"></div>
                <span>Đang xác thực...</span>
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Khu vực tài khoản mẫu để test nhanh UI01 */}
        <div className="demo-section">
          <div className="demo-title">Tài khoản mẫu thử nghiệm nhanh</div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className="btn-demo"
              onClick={() => handleQuickFill('nguyenvana@gmail.com', 'INSTRUCTOR')}
              title="Click để điền tài khoản Giảng viên"
            >
              <strong>👨‍🏫 Giảng viên A</strong>
              <span>nguyenvana@gmail.com</span>
            </button>

            <button
              type="button"
              className="btn-demo"
              onClick={() => handleQuickFill('nguyenvanb@gmail.com', 'STUDENT')}
              title="Click để điền tài khoản Sinh viên"
            >
              <strong>👨‍🎓 Sinh viên B</strong>
              <span>nguyenvanb@gmail.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
