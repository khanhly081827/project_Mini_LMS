const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực JSON Web Token từ Authorization Header (Bearer token)
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để tiếp tục truy cập'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_mini_lms_2026', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({
          success: false,
          message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
        });
      }
      return res.status(403).json({
        success: false,
        message: 'Mã xác thực không hợp lệ'
      });
    }

    req.user = decoded; // { id, email, role, full_name, iat, exp }
    next();
  });
}

/**
 * Middleware phân quyền người dùng theo vai trò (Role-Based Access Control)
 * @param  {...string} roles - Danh sách vai trò được phép (ví dụ: 'INSTRUCTOR', 'STUDENT')
 */
function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole
};
