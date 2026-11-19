---
name: create-lms-api
description: Tự động tạo trọn bộ một tính năng RESTful API hoàn chỉnh cho hệ thống Mini LMS (gồm routes, controller, service với Parameterized MySQL Queries, middleware phân quyền JWT và hàm gọi API phía React client) khớp với tài liệu SRS (FR01-FR06) và CSDL mini_lms. Kích hoạt skill này khi người dùng yêu cầu thêm API mới, tạo chức năng backend, hoặc nối API cho một màn hình UI01-UI08.
---

# Skill: Create Mini LMS Full-Stack Endpoint (`create-lms-api`)

## 1. Prerequisites / Context
Trước khi sinh code, Agent bắt buộc đọc các file sau để đảm bảo đồng bộ tên bảng, tên cột và cấu hình:
1. `database/schema_and_seed.sql`: Kiểm tra chính xác tên bảng và các cột (`snake_case`).
2. `server/src/config/db.js`: Kiểm tra cách export `pool` kết nối MySQL.
3. `server/src/middlewares/authMiddleware.js`: Kiểm tra tên hàm `authenticateToken` và `authorizeRole`.
4. `docs/So_do_luong_nghiep_vu.docx` (hoặc quy tắc nghiệp vụ trong `CLAUDE.md`): Kiểm tra các điều kiện ràng buộc (đăng ký khóa học, hạn nộp, định dạng file).

## 2. Step-by-Step Workflow
Thực hiện tuần tự 5 bước sau:
1. **Xác nhận Schema & Quyền truy cập:** Đối chiếu resource với `database/schema_and_seed.sql`. Xác định vai trò được phép gọi API (`STUDENT`, `INSTRUCTOR`, hoặc Public).
2. **Tạo tầng Service (`server/src/modules/<domain>/<domain>.service.js`):** Viết các hàm truy vấn MySQL bằng `pool.execute(sql, [params])`. Tuyệt đối không dùng `req`/`res` ở tầng này.
3. **Tạo tầng Controller (`server/src/modules/<domain>/<domain>.controller.js`):** Nhận dữ liệu từ `req.body` / `req.params` / `req.user`, validate đầu vào, gọi `service`, và trả về JSON chuẩn `{ success, data, message }`.
4. **Khai báo Routes (`server/src/modules/<domain>/<domain>.routes.js`):** Gắn middleware `authenticateToken` và `authorizeRole(...)` vào từng endpoint, sau đó đăng ký router vào `server/src/app.js`.
5. **Tạo hàm gọi API phía Client (`client/src/features/<domain>/<domain>Api.js`):** Viết hàm Axios tương ứng để React component có thể gọi ngay.

## 3. Code Template / Example (Few-Shot)

**Ví dụ chuẩn cho nghiệp vụ Nộp bài tập (`assignments` — `FR05` / `UI06`):**

`server/src/modules/assignments/assignments.service.js`:
```javascript
const pool = require('../../config/db');

async function findAssignmentById(assignmentId) {
  const [rows] = await pool.execute(
    'SELECT id, lesson_id, title, due_date, is_active FROM assignments WHERE id = ?',
    [assignmentId]
  );
  return rows[0] || null;
}

async function createSubmission({ assignmentId, studentId, selectedAnswer, fileName, submittedAt, submitStatus }) {
  const [result] = await pool.execute(
    `INSERT INTO submissions (assignment_id, student_id, selected_answer, file_name, submitted_at, submit_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [assignmentId, studentId, selectedAnswer, fileName, submittedAt, submitStatus]
  );
  return result.insertId;
}

module.exports = { findAssignmentById, createSubmission };