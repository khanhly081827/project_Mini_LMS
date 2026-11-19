const express = require('express');
const router = express.Router();
const lessonsController = require('./lessons.controller');
const { authenticateToken } = require('../../middlewares/authMiddleware');

// Lấy danh sách bài học thuộc khóa học (Protected)
router.get('/', authenticateToken, lessonsController.getLessons);

module.exports = router;
