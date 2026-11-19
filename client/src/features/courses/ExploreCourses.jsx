import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';

export default function ExploreCourses() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [enrolledIds, setEnrolledIds] = useState([1]);

  const allCourses = [
    {
      id: 1,
      title: 'Lập trình Web với ReactJS & NodeJS',
      description: 'Khóa học cung cấp kiến thức nền tảng và nâng cao về kiến trúc 3 tầng (ReactJS, ExpressJS, MySQL) để xây dựng ứng dụng Web thực tế.',
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
      instructor_name: 'GV. Nguyễn Văn A',
      lessonsCount: 2,
      assignmentsCount: 1,
      rating: 4.9
    },
    {
      id: 2,
      title: 'Xây dựng RESTful API và Cơ chế Xác thực JWT',
      description: 'Chuyên sâu về thiết kế REST API chuẩn quốc tế, bảo mật JWT token, mã hóa bcrypt và kiểm thử tự động với Node.js.',
      thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
      instructor_name: 'GV. Nguyễn Văn A',
      lessonsCount: 4,
      assignmentsCount: 2,
      rating: 4.8
    },
    {
      id: 3,
      title: 'Thiết kế & Tối ưu Cơ sở Dữ liệu MySQL cho Web',
      description: 'Mô hình hóa dữ liệu quan hệ, chỉ mục Indexing, chuẩn hóa 3NF và viết truy vấn phức tạp tối ưu hiệu năng cho hệ thống lớn.',
      thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60',
      instructor_name: 'GV. Nguyễn Văn A',
      lessonsCount: 3,
      assignmentsCount: 1,
      rating: 4.7
    }
  ];

  const filteredCourses = allCourses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnroll = (courseId) => {
    if (enrolledIds.includes(courseId)) {
      navigate(`/student/courses/${courseId}`);
    } else {
      setEnrolledIds(prev => [...prev, courseId]);
      alert('Đăng ký khóa học thành công! Chúc bạn có trải nghiệm học tập tốt.');
      navigate(`/student/courses/${courseId}`);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            Khám phá Khóa học (UI04)
          </h1>
          <StatusBadge type="STUDENT" label="Sinh viên" />
        </div>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
          Tìm kiếm và đăng ký tham gia các khóa học chất lượng cao từ các giảng viên.
        </p>
      </div>

      {/* Tìm kiếm */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên khóa học hoặc nội dung..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            maxWidth: '480px',
            padding: '11px 16px',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#ffffff'
          }}
        />
      </div>

      {/* Grid Khóa học */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledIds.includes(course.id);
          return (
            <div
              key={course.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                transition: 'all 0.2s'
              }}
            >
              <img
                src={course.thumbnail_url}
                alt={course.title}
                style={{ width: '100%', height: '175px', objectFit: 'cover' }}
              />

              <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                    👨‍🏫 {course.instructor_name}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#d97706' }}>
                    ★ {course.rating}
                  </span>
                </div>

                <h3 style={{ fontSize: '16.5px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.35 }}>
                  {course.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.45, flex: 1 }}>
                  {course.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12.5px',
                  color: '#475569',
                  marginBottom: '16px',
                  backgroundColor: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '6px'
                }}>
                  <span>🎥 {course.lessonsCount} bài giảng</span>
                  <span>📝 {course.assignmentsCount} bài tập</span>
                  <span style={{ color: '#059669', fontWeight: '600' }}>Miễn phí</span>
                </div>

                <button
                  onClick={() => handleEnroll(course.id)}
                  style={{
                    backgroundColor: isEnrolled ? '#059669' : '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {isEnrolled ? 'Vào học ngay →' : 'Đăng ký học'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
