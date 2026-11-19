const coursesService = require('./courses.service');

/**
 * Lấy danh sách khóa học
 */
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

/**
 * Lấy chi tiết khóa học kèm danh sách chương, bài học và bài tập
 */
async function getCourseDetail(req, res, next) {
  try {
    const { id } = req.params;
    const course = await coursesService.findCourseDetailById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin khóa học'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin chi tiết khóa học thành công',
      data: course
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Thêm chương mục mới cho khóa học (Giảng viên)
 */
async function addModule(req, res, next) {
  try {
    const { id: courseId } = req.params;
    const { title, orderIndex } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên chương mục'
      });
    }

    const moduleId = await coursesService.createModule({
      courseId,
      title: title.trim(),
      orderIndex: orderIndex || 1
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm chương mục thành công',
      data: { moduleId, title: title.trim(), orderIndex }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Thêm bài học mới vào chương (Giảng viên)
 */
async function addLesson(req, res, next) {
  try {
    const { moduleId, title, content, videoUrl, orderIndex } = req.body;

    if (!moduleId || !title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn chương và nhập tiêu đề bài học'
      });
    }

    const lessonId = await coursesService.createLesson({
      moduleId,
      title: title.trim(),
      content,
      videoUrl,
      orderIndex: orderIndex || 1
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm bài học thành công',
      data: { lessonId, title: title.trim(), moduleId }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Thêm bài tập mới (Giảng viên)
 */
async function addAssignment(req, res, next) {
  try {
    const { lessonId, title, description, dueDate, maxScore } = req.body;

    if (!lessonId || !title || !title.trim() || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ tiêu đề bài tập, bài học và hạn nộp'
      });
    }

    const assignmentId = await coursesService.createAssignment({
      lessonId,
      title: title.trim(),
      description,
      dueDate,
      maxScore: maxScore || 10.0
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo bài tập thành công',
      data: { assignmentId, title: title.trim(), lessonId, dueDate }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Lấy danh sách bài nộp cần chấm của giảng viên
 */
async function getInstructorSubmissions(req, res, next) {
  try {
    const instructorId = req.user.id;
    const submissions = await coursesService.getSubmissionsForInstructor(instructorId);

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách bài nộp thành công',
      data: submissions
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Chấm điểm bài nộp của sinh viên
 */
async function gradeSubmission(req, res, next) {
  try {
    const { submissionId } = req.params;
    const { score, feedback } = req.body;

    if (score === undefined || score === null || score < 0 || score > 10) {
      return res.status(400).json({
        success: false,
        message: 'Điểm số phải nằm trong khoảng từ 0 đến 10'
      });
    }

    const updated = await coursesService.gradeSubmission({
      submissionId,
      score: parseFloat(score),
      feedback
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài nộp để chấm điểm'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã lưu điểm và nhận xét thành công',
      data: { submissionId, score, feedback }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCourses,
  getCourseDetail,
  addModule,
  addLesson,
  addAssignment,
  getInstructorSubmissions,
  gradeSubmission
};
