const coursesService = require('./courses.service');

async function getCourses(req, res, next) {
  try {
    const courses = await coursesService.getAllCourses();
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách khóa học thành công',
      data: courses
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCourses
};
