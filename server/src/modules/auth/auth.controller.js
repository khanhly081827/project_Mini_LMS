const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('./auth.service');
const { isValidEmail } = require('../../utils/validators');

/**
 * Controller xử lý đăng nhập hệ thống (FR01)
 * Endpoint: POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào bắt buộc
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ email và mật khẩu'
      });
    }

    // 2. Kiểm tra định dạng email
    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng email không hợp lệ'
      });
    }

    // 3. Tìm tài khoản trong database bằng Parameterized Query
    const user = await authService.findUserByEmail(trimmedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // 4. So khớp mật khẩu đã băm bằng Bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // 5. Tạo JSON Web Token chứa định danh và Role
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_jwt_key_mini_lms_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // 6. Trả về kết quả JSON chuẩn
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller lấy thông tin người dùng hiện tại dựa trên Token (FR01)
 * Endpoint: GET /api/auth/me
 */
async function getMe(req, res, next) {
  try {
    const user = await authService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  getMe
};
