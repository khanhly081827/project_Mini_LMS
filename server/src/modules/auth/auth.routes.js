const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authenticateToken } = require('../../middlewares/authMiddleware');

// Endpoint đăng nhập hệ thống (Public)
router.post('/login', authController.login);

// Endpoint lấy thông tin người dùng đang đăng nhập (Protected)
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
