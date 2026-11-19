const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./modules/auth/auth.routes');
const coursesRoutes = require('./modules/courses/courses.routes');
const lessonsRoutes = require('./modules/lessons/lessons.routes');
const assignmentsRoutes = require('./modules/assignments/assignments.routes');

const app = express();

// 1. Cấu hình CORS
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// 2. Parse JSON & URL-encoded request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mini LMS API Server đang hoạt động bình thường',
    timestamp: new Date().toISOString()
  });
});

// 4. Khai báo các API routes chính
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/assignments', assignmentsRoutes);

// 5. Bắt các route không tồn tại (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy tài nguyên: ${req.method} ${req.originalUrl}`
  });
});

// 6. Middleware xử lý lỗi tập trung chuẩn JSON
app.use(errorHandler);

module.exports = app;
