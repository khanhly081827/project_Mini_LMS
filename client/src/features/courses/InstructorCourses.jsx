import React from 'react';
import useAuth from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';

export default function InstructorCourses() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
            Không gian Giảng viên (UI02)
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            Chào mừng Thầy/Cô <strong>{user?.full_name}</strong>. Quản lý danh sách khóa học và giáo án bài giảng.
          </p>
        </div>
        <StatusBadge type="INSTRUCTOR" label="Giảng viên" />
      </div>

      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
          Khóa học đang giảng dạy
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
              Khóa học cung cấp kiến thức nền tảng và nâng cao về kiến trúc 3 tầng (ReactJS, ExpressJS, MySQL).
            </p>
            <span style={{ fontSize: '12px', color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' }}>
              Đang xuất bản (PUBLISHED)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
