# Mini LMS — Hệ thống Quản lý Học tập Trực tuyến

Dự án Đồ án I xây dựng hệ thống quản lý học tập trực tuyến Mini LMS theo kiến trúc 3 tầng:
- **Frontend:** ReactJS 18 + React Router v6 + Axios (Port: 3000)
- **Backend:** NodeJS + ExpressJS + `mysql2/promise` + JWT + Bcrypt (Port: 5000)
- **Database:** MySQL 8.x (`mini_lms`)

---

## 1. Cấu trúc Thư mục

```text
project_Mini_LMS/
├── client/                     # Frontend ReactJS (UI01 - UI08)
│   ├── src/
│   │   ├── api/                # axiosClient.js (JWT Interceptor)
│   │   ├── components/         # Navbar, ProtectedRoute, StatusBadge
│   │   ├── context/            # AuthContext.jsx
│   │   ├── features/           # auth (UI01), courses (UI02, UI04), lessons, assignments
│   │   ├── hooks/              # useAuth.js
│   │   ├── utils/              # formatters.js
│   │   ├── App.jsx             # Định tuyến & phân quyền Role
│   │   └── main.jsx
│   └── package.json
├── server/                     # Backend NodeJS/ExpressJS (FR01 - FR06)
│   ├── src/
│   │   ├── config/             # db.js (MySQL Pool kết nối an toàn)
│   │   ├── middlewares/        # authMiddleware.js (JWT & Phân quyền), errorHandler.js
│   │   ├── modules/            # auth, courses, lessons, assignments (Routes -> Controllers -> Services)
│   │   ├── utils/              # validators.js
│   │   └── app.js              # Khởi tạo Express app & CORS
│   ├── server.js               # Entry point máy chủ (Port 5000)
│   ├── .env.example
│   └── package.json
└── database/
    └── schema_and_seed.sql     # Script khởi tạo 8 bảng MySQL & Dữ liệu mẫu
```

---

## 2. Hướng dẫn Cài đặt & Khởi chạy

### Bước 1: Khởi tạo Cơ sở Dữ liệu MySQL
1. Khởi động dịch vụ MySQL (qua XAMPP, MySQL Server hoặc Docker).
2. Import file `database/schema_and_seed.sql` vào MySQL:
   ```bash
   mysql -u root -p < database/schema_and_seed.sql
   ```
   *CSDL `mini_lms` sẽ được tự động tạo với 8 bảng và dữ liệu mẫu.*

### Bước 2: Chạy Backend Server
```bash
cd server
npm install
npm start
# Server chạy tại: http://localhost:5000 (API Health: http://localhost:5000/api/health)
```

### Bước 3: Chạy Frontend Client
```bash
cd client
npm install
npm start
# Client chạy tại: http://localhost:3000
```

---

## 3. Tài khoản Mẫu thử nghiệm (Seed Data)

Cả 2 tài khoản đều dùng mật khẩu mặc định: `123456`

| Vai trò | Họ tên | Email | Mật khẩu | Quyền truy cập |
| :--- | :--- | :--- | :--- | :--- |
| **Giảng viên** | GV. Nguyễn Văn A | `nguyenvana@gmail.com` | `123456` | Quản lý khóa học, bài học, giao bài & chấm điểm (`INSTRUCTOR`) |
| **Sinh viên** | Nguyễn Văn B | `nguyenvanb@gmail.com` | `123456` | Khám phá khóa học, xem bài giảng, nộp bài tập (`STUDENT`) |

*Tại giao diện đăng nhập (UI01), có sẵn 2 nút click nhanh để tự động điền tài khoản mẫu Giảng viên / Sinh viên.*
