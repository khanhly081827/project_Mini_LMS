import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';

export default function StudentCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const enrolledCourses = [
    {
      id: 1,
      title: 'Lập trình Web với ReactJS & NodeJS',
      description: 'Khóa học cung cấp kiến thức nền tảng và nâng cao về kiến trúc 3 tầng (ReactJS, ExpressJS, MySQL).',
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
      instructor_name: 'GV. Nguyễn Văn A',
      progressPercent: 50,
      completedLessons: 1,
      totalLessons: 2,
      assignmentStatus: 'Đã nộp bài tập 1 (Điểm: 9.5)'
    }
  ];

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Khóa học của tôi (UI04)
            </h1>
            <StatusBadge type="STUDENT" label="Sinh viên" />
          </div>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            Chào mừng bạn <strong>{user?.full_name}</strong>. Chọn khóa học để tiếp tục tiến trình học và nộp bài tập.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/explore')}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
          }}
        >
          🔍 Khám phá khóa học mới
        </button>
      </div>

      {/* Danh sách Khóa học đã đăng ký */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Khóa học đang theo học ({enrolledCourses.length})
          </h2>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            💡 Bấm vào thẻ khóa học để vào giao diện học tập (UI05)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/student/courses/${course.id}`)}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/student/courses/${course.id}`); }}
            >
              <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <StatusBadge type="ACTIVE" label="Đang học" />
                </div>
              </div>

              <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16.5px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>
                  Giảng viên: <strong>{course.instructor_name}</strong>
                </p>

                {/* Thanh tiến độ */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                    <span>Tiến độ: {course.completedLessons}/{course.totalLessons} bài</span>
                    <span style={{ fontWeight: '700', color: '#2563eb' }}>{course.progressPercent}%</span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${course.progressPercent}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: '999px' }}></div>
                  </div>
                </div>

                <div style={{
                  padding: '8px 10px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#065f46',
                  fontWeight: '500',
                  marginBottom: '14px'
                }}>
                  ✅ {course.assignmentStatus}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '12px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#2563eb' }}>
                    Tiếp tục học bài →
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    UI05
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
