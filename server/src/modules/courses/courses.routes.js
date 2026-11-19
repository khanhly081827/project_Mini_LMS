const express = require('express');
const router = express.Router();
const coursesController = require('./courses.controller');

// Lấy danh sách khóa học công khai
router.get('/', coursesController.getCourses);

module.exports = router;
