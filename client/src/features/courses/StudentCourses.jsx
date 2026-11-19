import React from 'react';
import useAuth from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';

export default function StudentCourses() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
            Khóa học của tôi (UI04)
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            Chào mừng bạn <strong>{user?.full_name}</strong>. Tiếp tục theo dõi tiến độ học tập và bài tập của bạn.
          </p>
        </div>
        <StatusBadge type="STUDENT" label="Sinh viên" />
      </div>

      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
          Khóa học đã đăng ký
        </h2>
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <img
            src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"
            alt="ReactJS & NodeJS"
            style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0 0 6px 0' }}>
              Lập trình Web với ReactJS & NodeJS
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' }}>
              Giảng viên phụ trách: <strong>GV. Nguyễn Văn A</strong>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' }}>
                Tiến độ: Đã học 1/2 bài (50%)
              </span>
              <span style={{ fontSize: '12px', color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' }}>
                Đã nộp bài tập 1 (Điểm: 9.5)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
