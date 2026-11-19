-- =====================================================================
-- CSDL Mini LMS (Hệ thống Quản lý Học tập Trực tuyến)
-- Phiên bản: 1.0.1 (Tương thích 100% MySQL Workbench & MySQL 8.x)
-- Kiến trúc: 3 tầng (ReactJS, NodeJS/ExpressJS, MySQL)
-- =====================================================================

-- 1. Tạm tắt kiểm tra ràng buộc để xóa và tạo bảng không bị xung đột
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- 2. Khởi tạo Database sạch sẽ (Xóa database cũ để dọn sạch toàn bộ foreign keys cũ trong InnoDB)
DROP DATABASE IF EXISTS `mini_lms`;
CREATE DATABASE IF NOT EXISTS `mini_lms` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mini_lms`;

-- 3. Xóa các bảng cũ theo thứ tự nếu có
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `assignments`;
DROP TABLE IF EXISTS `lesson_progress`;
DROP TABLE IF EXISTS `enrollments`;
DROP TABLE IF EXISTS `lessons`;
DROP TABLE IF EXISTS `modules`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `users`;

-- =====================================================================
-- 4. TẠO CÁC BẢNG (TABLE SCHEMAS)
-- =====================================================================

-- 4.1. BẢNG USERS (Người dùng: Giảng viên & Sinh viên)
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('INSTRUCTOR', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    `avatar_url` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.2. BẢNG COURSES (Khóa học do Giảng viên tạo)
CREATE TABLE `courses` (
    `id` INT AUTO_INCREMENT,
    `instructor_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `thumbnail_url` VARCHAR(255) DEFAULT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'PUBLISHED',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_courses_instructor` (`instructor_id`),
    CONSTRAINT `fk_courses_instructor` FOREIGN KEY (`instructor_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.3. BẢNG MODULES (Chương mục thuộc Khóa học)
CREATE TABLE `modules` (
    `id` INT AUTO_INCREMENT,
    `course_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `order_index` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_modules_course` (`course_id`),
    CONSTRAINT `fk_modules_course` FOREIGN KEY (`course_id`) 
        REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.4. BẢNG LESSONS (Bài học thuộc Chương mục)
CREATE TABLE `lessons` (
    `id` INT AUTO_INCREMENT,
    `module_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` LONGTEXT DEFAULT NULL,
    `video_url` VARCHAR(255) DEFAULT NULL,
    `order_index` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_lessons_module` (`module_id`),
    CONSTRAINT `fk_lessons_module` FOREIGN KEY (`module_id`) 
        REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.5. BẢNG ENROLLMENTS (Đăng ký khóa học của Sinh viên)
CREATE TABLE `enrollments` (
    `id` INT AUTO_INCREMENT,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('ACTIVE', 'COMPLETED', 'DROPPED') NOT NULL DEFAULT 'ACTIVE',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_student_course` (`student_id`, `course_id`),
    KEY `idx_enrollments_student` (`student_id`),
    KEY `idx_enrollments_course` (`course_id`),
    CONSTRAINT `fk_enrollments_student` FOREIGN KEY (`student_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) 
        REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.6. BẢNG LESSON_PROGRESS (Tiến độ học tập của Sinh viên)
CREATE TABLE `lesson_progress` (
    `id` INT AUTO_INCREMENT,
    `student_id` INT NOT NULL,
    `lesson_id` INT NOT NULL,
    `is_completed` TINYINT(1) NOT NULL DEFAULT 0,
    `completed_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_student_lesson` (`student_id`, `lesson_id`),
    KEY `idx_progress_student` (`student_id`),
    KEY `idx_progress_lesson` (`lesson_id`),
    CONSTRAINT `fk_progress_student` FOREIGN KEY (`student_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_progress_lesson` FOREIGN KEY (`lesson_id`) 
        REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.7. BẢNG ASSIGNMENTS (Bài tập giao theo bài học)
CREATE TABLE `assignments` (
    `id` INT AUTO_INCREMENT,
    `lesson_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `due_date` DATETIME NOT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `max_score` DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_assignments_lesson` (`lesson_id`),
    CONSTRAINT `fk_assignments_lesson` FOREIGN KEY (`lesson_id`) 
        REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.8. BẢNG SUBMISSIONS (Bài nộp của Sinh viên & Điểm số)
CREATE TABLE `submissions` (
    `id` INT AUTO_INCREMENT,
    `assignment_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `selected_answer` TEXT DEFAULT NULL,
    `file_name` VARCHAR(255) DEFAULT NULL,
    `file_url` VARCHAR(255) DEFAULT NULL,
    `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `submit_status` VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED', -- 'SUBMITTED', 'ON_TIME', 'LATE'
    `score` DECIMAL(5,2) DEFAULT NULL,
    `feedback` TEXT DEFAULT NULL,
    `graded_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_submissions_assignment` (`assignment_id`),
    KEY `idx_submissions_student` (`student_id`),
    CONSTRAINT `fk_submissions_assignment` FOREIGN KEY (`assignment_id`) 
        REFERENCES `assignments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_submissions_student` FOREIGN KEY (`student_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 5. DỮ LIỆU MẪU (SEED DATA)
-- Mật khẩu mặc định cho cả Giảng viên & Sinh viên: 123456
-- Bcrypt Hash: $2a$10$RejUYVepa3oChtRj9DAmg.vqIToSuj/MqfmlPOIWTPRFTj9a2EXS2
-- =====================================================================

-- 5.1. Thêm Người dùng mẫu
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `avatar_url`) VALUES 
(1, 'GV. Nguyễn Văn A', 'nguyenvana@gmail.com', '$2a$10$RejUYVepa3oChtRj9DAmg.vqIToSuj/MqfmlPOIWTPRFTj9a2EXS2', 'INSTRUCTOR', 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherA'),
(2, 'Nguyễn Văn B', 'nguyenvanb@gmail.com', '$2a$10$RejUYVepa3oChtRj9DAmg.vqIToSuj/MqfmlPOIWTPRFTj9a2EXS2', 'STUDENT', 'https://api.dicebear.com/7.x/avataaars/svg?seed=StudentB');

-- 5.2. Thêm Khóa học mẫu
INSERT INTO `courses` (`id`, `instructor_id`, `title`, `description`, `thumbnail_url`, `status`) VALUES 
(1, 1, 'Lập trình Web với ReactJS & NodeJS', 'Khóa học cung cấp kiến thức nền tảng và nâng cao về kiến trúc 3 tầng (ReactJS, ExpressJS, MySQL) để xây dựng ứng dụng Web thực tế.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60', 'PUBLISHED');

-- 5.3. Thêm Chương mục (Modules) mẫu
INSERT INTO `modules` (`id`, `course_id`, `title`, `order_index`) VALUES 
(1, 1, 'Chương 1: Kiến trúc Ứng dụng Web & Tổng quan', 1),
(2, 1, 'Chương 2: Xây dựng Backend RESTful API & MySQL', 2);

-- 5.4. Thêm Bài học (Lessons) mẫu
INSERT INTO `lessons` (`id`, `module_id`, `title`, `content`, `video_url`, `order_index`) VALUES 
(1, 1, 'Bài 1: Kiến trúc 3 tầng Client - Server - Database', 'Trong bài học này, chúng ta sẽ tìm hiểu về mô hình 3 tầng Client-Server, vai trò của ReactJS ở tầng Frontend, ExpressJS ở tầng Backend và MySQL ở tầng CSDL.', 'https://www.youtube.com/watch?v=Ke90Tje7VS0', 1),
(2, 2, 'Bài 2: Thiết kế RESTful API & Xác thực người dùng bằng JWT', 'Tìm hiểu chuẩn thiết kế RESTful API, mã hóa mật khẩu với Bcrypt và cơ chế xác thực không trạng thái (stateless authentication) với JSON Web Token (JWT).', 'https://www.youtube.com/watch?v=mbsmsi7l3r4', 1);

-- 5.5. Thêm Đăng ký khóa học (Enrollments) mẫu: Sinh viên B đăng ký khóa 1
INSERT INTO `enrollments` (`id`, `student_id`, `course_id`, `enrolled_at`, `status`) VALUES 
(1, 2, 1, NOW(), 'ACTIVE');

-- 5.6. Thêm Tiến độ bài học (Lesson Progress) mẫu: Sinh viên B đã hoàn thành Bài 1
INSERT INTO `lesson_progress` (`id`, `student_id`, `lesson_id`, `is_completed`, `completed_at`) VALUES 
(1, 2, 1, 1, NOW());

-- 5.7. Thêm Bài tập (Assignments) mẫu gắn với Bài 2
INSERT INTO `assignments` (`id`, `lesson_id`, `title`, `description`, `due_date`, `is_active`, `max_score`) VALUES 
(1, 2, 'Bài tập 1: Xây dựng API Đăng nhập và Middleware phân quyền JWT', 'Yêu cầu: Sinh viên xây dựng endpoint POST /api/auth/login, kiểm tra bcrypt password và trả về JWT token. Viết authMiddleware để bảo vệ các routes.', '2026-12-31 23:59:59', 1, 10.00);

-- 5.8. Thêm Bài nộp (Submissions) mẫu: Sinh viên B nộp Bài tập 1
INSERT INTO `submissions` (`id`, `assignment_id`, `student_id`, `selected_answer`, `file_name`, `file_url`, `submitted_at`, `submit_status`, `score`, `feedback`, `graded_at`) VALUES 
(1, 1, 2, 'Em đã hoàn thành bài tập nộp kèm mã nguồn zip.', 'bai_tap_1_nguyenvanb.zip', '/uploads/submissions/bai_tap_1_nguyenvanb.zip', NOW(), 'ON_TIME', 9.50, 'Bài làm rất tốt, cấu trúc thư mục chuẩn và xử lý lỗi đầy đủ.', NOW());

-- =====================================================================
-- 6. KHÔI PHỤC KIỂM TRA RÀNG BUỘC
-- =====================================================================
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;
