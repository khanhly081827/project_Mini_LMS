import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';

export default function InstructorCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Khóa học mẫu của Giảng viên
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Lập trình Web với ReactJS & NodeJS',
      description: 'Khóa học cung cấp kiến thức nền tảng và nâng cao về kiến trúc 3 tầng (ReactJS, ExpressJS, MySQL) để xây dựng ứng dụng Web thực tế.',
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
      status: 'PUBLISHED',
      moduleCount: 2,
      lessonCount: 2,
      assignmentCount: 1,
      studentCount: 1
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'Mô tả khóa học mới',
      thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
      status: 'PUBLISHED',
      moduleCount: 0,
      lessonCount: 0,
      assignmentCount: 0,
      studentCount: 0
    };

    setCourses(prev => [...prev, newCourse]);
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Không gian Giảng viên (UI02)
            </h1>
            <StatusBadge type="INSTRUCTOR" label="Giảng viên" />
          </div>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            Chào mừng Thầy/Cô <strong>{user?.full_name}</strong>. Chọn khóa học để quản lý nội dung chi tiết hoặc tạo mới.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
          }}
        >
          <span>+</span> Tạo khóa học mới
        </button>
      </div>

      {/* Danh sách Khóa học */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Khóa học đang phụ trách ({courses.length})
          </h2>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            💡 Nhấp chuột vào thẻ khóa học bất kỳ để mở trang Quản lý bài học & Bài tập (UI03)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/instructor/courses/${course.id}`)}
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
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/instructor/courses/${course.id}`); }}
            >
              {/* Ảnh Thumbnail */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <StatusBadge type="ACTIVE" label="Đang xuất bản" />
                </div>
              </div>

              {/* Thông tin Khóa học */}
              <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16.5px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.35 }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.45, flex: 1 }}>
                  {course.description}
                </p>

                {/* Thống kê nhanh */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  color: '#475569',
                  marginBottom: '14px'
                }}>
                  <span>📚 {course.moduleCount} chương</span>
                  <span>🎥 {course.lessonCount} bài giảng</span>
                  <span>📝 {course.assignmentCount} bài tập</span>
                  <span>👥 {course.studentCount} sinh viên</span>
                </div>

                {/* Nút hành động */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '12px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#2563eb' }}>
                    Quản lý bài giảng & bài tập →
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    UI03
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tạo Khóa học */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
              Tạo khóa học mới
            </h3>
            <form onSubmit={handleCreateCourse}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Tên khóa học *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lập trình Full-Stack Web Development"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  required
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Mô tả khóa học
                </label>
                <textarea
                  rows="3"
                  placeholder="Giới thiệu mục tiêu và nội dung khóa học..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#475569', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', border: 'none', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
                >
                  Tạo khóa học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
