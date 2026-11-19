const pool = require('../../config/db');

/**
 * Tìm người dùng theo email (phục vụ đăng nhập)
 * Sử dụng Parameterized Query 100% để chống SQL Injection
 */
async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT id, full_name, email, password, role, avatar_url FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

/**
 * Tìm người dùng theo ID (phục vụ lấy thông tin phiên đăng nhập)
 */
async function findUserById(id) {
  const [rows] = await pool.execute(
    'SELECT id, full_name, email, role, avatar_url, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  findUserByEmail,
  findUserById
};
