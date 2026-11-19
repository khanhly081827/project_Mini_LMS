const pool = require('../../config/db');

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

module.exports = {
  getAllCourses
};
