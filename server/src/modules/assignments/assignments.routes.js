const express = require('express');
const router = express.Router();
const assignmentsController = require('./assignments.controller');
const { authenticateToken, authorizeRole } = require('../../middlewares/authMiddleware');

// Xem chi tiết bài tập (Protected: Cả Giảng viên & Sinh viên)
router.get('/:id', authenticateToken, assignmentsController.getAssignmentDetail);

// Nộp bài tập (Protected: Chỉ dành cho STUDENT)
router.post('/:id/submit', authenticateToken, authorizeRole('STUDENT'), assignmentsController.submitAssignment);

module.exports = router;
