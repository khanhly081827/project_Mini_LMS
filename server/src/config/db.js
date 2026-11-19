const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mini_lms',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Kiểm tra kết nối cơ sở dữ liệu
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Kết nối MySQL thành công tới database: ${process.env.DB_NAME || 'mini_lms'}`);
    connection.release();
  } catch (error) {
    console.warn(`[Database] Cảnh báo: Chưa kết nối được MySQL (${error.message}). Vui lòng đảm bảo dịch vụ MySQL đang chạy và file database/schema_and_seed.sql đã được import.`);
  }
})();

module.exports = pool;
