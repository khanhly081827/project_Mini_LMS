```markdown
# PROJECT RULES — MINI LMS (ĐỒ ÁN I — NHÓM 7)

## 1. Tech Stack & Commands
- **Frontend:** ReactJS 18, Axios, CSS (port `3000`).
- **Backend:** Node.js, ExpressJS, `jsonwebtoken`, `mysql2/promise` (port `5000`).
- **Database:** MySQL (`mini_lms`).
- **Commands:**
  - Install: `cd server && npm install` | `cd client && npm install`
  - Run Backend: `cd server && npm start`
  - Run Frontend: `cd client && npm start`
  - Build Frontend: `cd client && npm run build`

## 2. Architecture & File Placement
- Place all RESTful APIs under `server/src/modules/<domain>/` split into `.routes.js`, `.controller.js`, and `.service.js`.
- Place JWT verification and role checks in `server/src/middlewares/authMiddleware.js`.
- Place React UI screens (`UI01`–`UI08`) inside `client/src/features/<feature>/`.
- Place reusable stateless UI elements in `client/src/components/`.
- Keep all SQL schema changes synchronized in `database/schema_and_seed.sql`.

## 3. Coding Conventions
- **SQL Security:** Use Parameterized SQL Queries (`pool.execute('SELECT ... WHERE id = ?', [id])`) for 100% of database operations.
- **API Response Format:** Always return consistent JSON:
  - Success: `res.status(200|201).json({ success: true, data, message })`
  - Error: `res.status(400|401|403|404|500).json({ success: false, message })`
- **Authentication:** Store JWT in `localStorage` under key `mini_lms_token`; attach via Axios request interceptor.
- **Business Validation (Assignment Submission):** Validate enrollment status, `due_date`, and file extension (`.zip`, `.rar`, `.pdf`, `.docx`, `.txt`, max 20MB) before inserting into `submissions`.

## 4. Strict Don'ts (Cấm tuyệt đối)
- NEVER concatenate user input directly into SQL strings (`"SELECT * FROM users WHERE email = '" + email + "'"` is strictly forbidden).
- NEVER hardcode database passwords or `JWT_SECRET` in source files; always read from `process.env`.
- NEVER install heavy external UI libraries (MUI, AntD, Redux) without explicit approval; keep dependencies lightweight.
- NEVER write raw `fetch`/`axios` calls directly inside presentational UI components; extract them into `features/<feature>/<feature>Api.js`.
- NEVER skip role authorization (`INSTRUCTOR` vs `STUDENT`) on mutating endpoints (`POST`, `PUT`, `DELETE`).

## 5. Verification Checklist
Before marking any task complete, verify:
1. All new database queries use `?` placeholders in `pool.execute()`.
2. Protected endpoints include both `authenticateToken` and `authorizeRole(...)`.
3. Client build (`cd client && npm run build`) completes with zero syntax or import errors.
4. Changes align with `database/schema_and_seed.sql` column names (`snake_case`).
