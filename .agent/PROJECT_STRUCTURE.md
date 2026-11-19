# Kiến trúc & Cấu trúc Thư mục Dự án Mini LMS

- **Tên & Mô tả dự án:** Mini LMS — Hệ thống quản lý học tập trực tuyến hỗ trợ giảng viên tạo khóa học, giao bài tập, chấm điểm và học viên đăng ký học, theo dõi tiến độ, nộp bài trực tuyến.
- **Tech Stack:** ReactJS 18 (Axios, React Router, CSS Modules/Tailwind), Node.js & ExpressJS (JWT, `mysql2/promise`), MySQL 8 (`mini_lms`).
- **Quy mô & Team:** MVP Đồ án I — Nhóm 2 thành viên làm việc kết hợp với AI Coding Agents.
- **Kiến trúc lựa chọn:** Client–Server 3 tầng (Monorepo tách `client/`, `server/`, `database/`, `docs/`) kết hợp **Feature-based** ở Frontend và **Layered Architecture (Routes → Controllers → Services → DB)** ở Backend.

## 1. Cây thư mục chi tiết

```text
Mini-LMS/
├── client/                         # Frontend ReactJS (UI01 - UI08)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/                    # Cấu hình Axios instance & gắn JWT Interceptor
│   │   │   └── axiosClient.js
│   │   ├── components/             # UI dùng chung (Navbar, StatusBadge, Modal, FileDropzone)
│   │   ├── context/                # Quản lý trạng thái đăng nhập & Role (AuthContext.jsx)
│   │   ├── features/               # Chia theo cụm nghiệp vụ khớp UI01 - UI08
│   │   │   ├── auth/               # UI01: Login, Register, ForgotPassword
│   │   │   ├── courses/            # UI02 (QL Khóa học GV) & UI04 (Khám phá KH HV)
│   │   │   ├── lessons/            # UI03 (QL Bài học GV) & UI05 (Xem bài học HV)
│   │   │   └── assignments/        # UI06 (Làm & Nộp bài), UI07 (Tạo BT), UI08 (Chấm điểm)
│   │   ├── hooks/                  # Custom hooks dùng chung (useAuth, useDebounce)
│   │   ├── utils/                  # Hàm format ngày giờ, kiểm tra định dạng file nộp
│   │   ├── App.jsx                 # Khai báo định tuyến & phân quyền route theo Role
│   │   └── main.jsx
│   └── package.json
├── server/                         # Backend NodeJS & ExpressJS (RESTful API FR01 - FR06)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Kết nối MySQL Pool (mysql2/promise)
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js   # Xác thực JWT Token & phân quyền (STUDENT / INSTRUCTOR)
│   │   │   └── errorHandler.js     # Xử lý lỗi tập trung chuẩn JSON
│   │   ├── modules/                # Chia theo domain nghiệp vụ
│   │   │   ├── auth/               # auth.routes.js, auth.controller.js, auth.service.js
│   │   │   ├── courses/            # courses.routes.js, courses.controller.js, courses.service.js
│   │   │   ├── lessons/            # lessons.routes.js, lessons.controller.js, lessons.service.js
│   │   │   └── assignments/        # assignments.routes.js, assignments.controller.js, assignments.service.js
│   │   ├── utils/
│   │   │   └── validators.js       # Kiểm tra hạn nộp, định dạng file (.zip, .pdf, .docx, .txt)
│   │   └── app.js                  # Khởi tạo Express app, CORS, gắn routes
│   ├── server.js                   # Entry point khởi chạy server
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema_and_seed.sql         # Kịch bản tạo 8 bảng MySQL & dữ liệu mẫu
├── docs/                           # Tài liệu SRS, Use Case, ERD, Thiết kế UI, Luồng nghiệp vụ
├── .cursor/rules/                  # Bộ quy tắc phân tách theo scope cho AI Agent
├── CLAUDE.md                       # Bộ quy tắc tổng cho AI Coding Agents
└── README.md