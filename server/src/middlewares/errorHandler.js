/**
 * Middleware bắt và xử lý lỗi tập trung chuẩn JSON cho toàn bộ ứng dụng
 */
function errorHandler(err, req, res, next) {
  console.error('[Error Details]:', err);

  const statusCode = err.statusCode || res.statusCode >= 400 ? res.statusCode : 500;
  const message = err.message || 'Đã xảy ra lỗi trên máy chủ, vui lòng thử lại sau';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
