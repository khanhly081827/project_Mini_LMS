const lessonsService = require('./lessons.service');

async function getLessons(req, res, next) {
  try {
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu tham số courseId'
      });
    }

    const lessons = await lessonsService.getLessonsByCourseId(courseId);
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách bài học thành công',
      data: lessons
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLessons
};
