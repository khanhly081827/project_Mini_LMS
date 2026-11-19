const pool = require('../../config/db');

/**
 * Lấy danh sách tất cả các khóa học đã xuất bản
 */
async function getAllCourses() {
  const [rows] = await pool.execute(
    `SELECT c.id, c.title, c.description, c.thumbnail_url, c.status, c.created_at,
            u.full_name AS instructor_name
     FROM courses c
     JOIN users u ON c.instructor_id = u.id
     WHERE c.status = 'PUBLISHED'
     ORDER BY c.created_at DESC`
  );
  return rows;
}

/**
 * Lấy chi tiết khóa học bao gồm toàn bộ chương, bài giảng và bài tập
 */
async function findCourseDetailById(courseId) {
  // 1. Lấy thông tin khóa học
  const [courseRows] = await pool.execute(
    `SELECT c.id, c.instructor_id, c.title, c.description, c.thumbnail_url, c.status, c.created_at,
            u.full_name AS instructor_name, u.email AS instructor_email
     FROM courses c
     JOIN users u ON c.instructor_id = u.id
     WHERE c.id = ? LIMIT 1`,
    [courseId]
  );

  const course = courseRows[0];
  if (!course) return null;

  // 2. Lấy danh sách modules (chương mục)
  const [modules] = await pool.execute(
    `SELECT id, course_id, title, order_index, created_at
     FROM modules
     WHERE course_id = ?
     ORDER BY order_index ASC, id ASC`,
    [courseId]
  );

  // 3. Nếu có modules, lấy các bài học (lessons)
  if (modules.length > 0) {
    const moduleIds = modules.map(m => m.id);
    const placeholders = moduleIds.map(() => '?').join(',');
    
    const [lessons] = await pool.execute(
      `SELECT id, module_id, title, content, video_url, order_index, created_at
       FROM lessons
       WHERE module_id IN (${placeholders})
       ORDER BY order_index ASC, id ASC`,
      moduleIds
    );

    // 4. Nếu có lessons, lấy các bài tập (assignments)
    let assignments = [];
    if (lessons.length > 0) {
      const lessonIds = lessons.map(l => l.id);
      const lessonPlaceholders = lessonIds.map(() => '?').join(',');

      const [assignRows] = await pool.execute(
        `SELECT id, lesson_id, title, description, due_date, is_active, max_score, created_at
         FROM assignments
         WHERE lesson_id IN (${lessonPlaceholders})
         ORDER BY id ASC`,
        lessonIds
      );
      assignments = assignRows;
    }

    // Gắn assignments vào lessons
    lessons.forEach(lesson => {
      lesson.assignments = assignments.filter(a => a.lesson_id === lesson.id);
    });

    // Gắn lessons vào modules
    modules.forEach(mod => {
      mod.lessons = lessons.filter(l => l.module_id === mod.id);
    });
  }

  course.modules = modules;
  return course;
}

/**
 * Thêm chương mục mới cho khóa học
 */
async function createModule({ courseId, title, orderIndex }) {
  const [result] = await pool.execute(
    `INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)`,
    [courseId, title, orderIndex || 1]
  );
  return result.insertId;
}

/**
 * Thêm bài giảng mới vào chương
 */
async function createLesson({ moduleId, title, content, videoUrl, orderIndex }) {
  const [result] = await pool.execute(
    `INSERT INTO lessons (module_id, title, content, video_url, order_index) VALUES (?, ?, ?, ?, ?)`,
    [moduleId, title, content || '', videoUrl || '', orderIndex || 1]
  );
  return result.insertId;
}

/**
 * Thêm bài tập mới gắn với bài giảng
 */
async function createAssignment({ lessonId, title, description, dueDate, maxScore }) {
  const [result] = await pool.execute(
    `INSERT INTO assignments (lesson_id, title, description, due_date, is_active, max_score) 
     VALUES (?, ?, ?, ?, 1, ?)`,
    [lessonId, title, description || '', dueDate, maxScore || 10.0]
  );
  return result.insertId;
}

/**
 * Lấy danh sách các bài nộp của sinh viên cho các khóa học của giảng viên
 */
async function getSubmissionsForInstructor(instructorId) {
  const [rows] = await pool.execute(
    `SELECT s.id, s.assignment_id, s.student_id, s.selected_answer, s.file_name, s.file_url,
            s.submitted_at, s.submit_status, s.score, s.feedback, s.graded_at,
            u.full_name AS student_name, u.email AS student_email,
            a.title AS assignment_title, a.max_score,
            c.id AS course_id, c.title AS course_title
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     JOIN lessons l ON a.lesson_id = l.id
     JOIN modules m ON l.module_id = m.id
     JOIN courses c ON m.course_id = c.id
     JOIN users u ON s.student_id = u.id
     WHERE c.instructor_id = ?
     ORDER BY s.submitted_at DESC`,
    [instructorId]
  );
  return rows;
}

/**
 * Chấm điểm và gửi nhận xét cho bài nộp của sinh viên
 */
async function gradeSubmission({ submissionId, score, feedback }) {
  const [result] = await pool.execute(
    `UPDATE submissions
     SET score = ?, feedback = ?, graded_at = NOW()
     WHERE id = ?`,
    [score, feedback || null, submissionId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  getAllCourses,
  findCourseDetailById,
  createModule,
  createLesson,
  createAssignment,
  getSubmissionsForInstructor,
  gradeSubmission
};
