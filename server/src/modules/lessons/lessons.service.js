const pool = require('../../config/db');

async function getLessonsByCourseId(courseId) {
  const [rows] = await pool.execute(
    `SELECT l.id, l.module_id, l.title, l.video_url, l.order_index, m.title AS module_title
     FROM lessons l
     JOIN modules m ON l.module_id = m.id
     WHERE m.course_id = ?
     ORDER BY m.order_index ASC, l.order_index ASC`,
    [courseId]
  );
  return rows;
}

module.exports = {
  getLessonsByCourseId
};
