const express = require('express');
const router = express.Router();
const coursesController = require('./courses.controller');
const { authenticateToken, authorizeRole } = require('../../middlewares/authMiddleware');

// Lấy danh sách khóa học công khai
router.get('/', coursesController.getCourses);

// Lấy danh sách bài nộp để chấm điểm (Dành riêng cho Giảng viên)
router.get(
  '/instructor/submissions',
  authenticateToken,
  authorizeRole('INSTRUCTOR'),
  coursesController.getInstructorSubmissions
);

// Chấm điểm bài nộp của sinh viên (Dành riêng cho Giảng viên)
router.put(
  '/submissions/:submissionId/grade',
  authenticateToken,
  authorizeRole('INSTRUCTOR'),
  coursesController.gradeSubmission
);

// Thêm bài giảng mới (Dành riêng cho Giảng viên)
router.post(
  '/lessons',
  authenticateToken,
  authorizeRole('INSTRUCTOR'),
  coursesController.addLesson
);

// Thêm bài tập mới (Dành riêng cho Giảng viên)
router.post(
  '/assignments',
  authenticateToken,
  authorizeRole('INSTRUCTOR'),
  coursesController.addAssignment
);

// Lấy chi tiết khóa học kèm danh sách chương, bài học và bài tập (Protected)
router.get('/:id', authenticateToken, coursesController.getCourseDetail);

// Thêm chương mục mới cho khóa học (Dành riêng cho Giảng viên)
router.post(
  '/:id/modules',
  authenticateToken,
  authorizeRole('INSTRUCTOR'),
  coursesController.addModule
);

module.exports = router;
