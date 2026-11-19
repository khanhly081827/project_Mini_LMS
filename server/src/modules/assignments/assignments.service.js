const pool = require('../../config/db');

async function findAssignmentById(assignmentId) {
  const [rows] = await pool.execute(
    'SELECT id, lesson_id, title, description, due_date, is_active, max_score FROM assignments WHERE id = ?',
    [assignmentId]
  );
  return rows[0] || null;
}

async function createSubmission({ assignmentId, studentId, selectedAnswer, fileName, fileUrl, submittedAt, submitStatus }) {
  const [result] = await pool.execute(
    `INSERT INTO submissions (assignment_id, student_id, selected_answer, file_name, file_url, submitted_at, submit_status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [assignmentId, studentId, selectedAnswer || null, fileName || null, fileUrl || null, submittedAt || new Date(), submitStatus || 'SUBMITTED']
  );
  return result.insertId;
}

module.exports = {
  findAssignmentById,
  createSubmission
};
