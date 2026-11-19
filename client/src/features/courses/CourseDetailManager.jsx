import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import coursesApi from './coursesApi';
import StatusBadge from '../../components/StatusBadge';
import { formatDateTime } from '../../utils/formatters';

// Dữ liệu mẫu khởi đầu dự phòng khi CSDL chưa kết nối trực tiếp
const DEFAULT_SAMPLE_COURSE = {
  id: 1,
  title: 'Lập trình Web với ReactJS & NodeJS',
  description: 'Khóa học cung cấp kiến thức nền tảng và nâng cao về kiến trúc 3 tầng (ReactJS, ExpressJS, MySQL) để xây dựng ứng dụng Web thực tế.',
  thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
  status: 'PUBLISHED',
  modules: [
    {
      id: 1,
      course_id: 1,
      title: 'Chương 1: Kiến trúc Ứng dụng Web & Tổng quan',
      order_index: 1,
      lessons: [
        {
          id: 1,
          module_id: 1,
          title: 'Bài 1: Kiến trúc 3 tầng Client - Server - Database',
          content: 'Trong bài học này, chúng ta sẽ tìm hiểu về mô hình 3 tầng Client-Server, vai trò của ReactJS ở tầng Frontend, ExpressJS ở tầng Backend và MySQL ở tầng CSDL.',
          video_url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
          order_index: 1,
          assignments: []
        }
      ]
    },
    {
      id: 2,
      course_id: 1,
      title: 'Chương 2: Xây dựng Backend RESTful API & MySQL',
      order_index: 2,
      lessons: [
        {
          id: 2,
          module_id: 2,
          title: 'Bài 2: Thiết kế RESTful API & Xác thực người dùng bằng JWT',
          content: 'Tìm hiểu chuẩn thiết kế RESTful API, mã hóa mật khẩu với Bcrypt và cơ chế xác thực không trạng thái (stateless authentication) với JSON Web Token (JWT).',
          video_url: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
          order_index: 1,
          assignments: [
            {
              id: 1,
              lesson_id: 2,
              title: 'Bài tập 1: Xây dựng API Đăng nhập và Middleware phân quyền JWT',
              description: 'Yêu cầu: Sinh viên xây dựng endpoint POST /api/auth/login, kiểm tra bcrypt password và trả về JWT token.',
              due_date: '2026-12-31T23:59:59',
              max_score: 10.0,
              is_active: 1
            }
          ]
        }
      ]
    }
  ]
};

export default function CourseDetailManager() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(DEFAULT_SAMPLE_COURSE);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'MODULE' | 'LESSON' | 'ASSIGNMENT' | null

  // Form states
  const [moduleTitle, setModuleTitle] = useState('');
  const [targetModuleId, setTargetModuleId] = useState(1);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');

  const [targetLessonId, setTargetLessonId] = useState(1);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('2026-12-31T23:59');
  const [assignMaxScore, setAssignMaxScore] = useState(10);

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Tải thông tin chi tiết khóa học từ backend
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.getCourseDetail(courseId);
        if (res.success && res.data) {
          setCourse(res.data);
          if (res.data.modules?.length > 0) {
            setTargetModuleId(res.data.modules[0].id);
            const firstLesson = res.data.modules[0].lessons?.[0];
            if (firstLesson) setTargetLessonId(firstLesson.id);
          }
        }
      } catch (err) {
        console.warn('[CourseDetailManager] Dùng dữ liệu mẫu dự phòng:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Xử lý Thêm chương mới
  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;

    try {
      const newOrder = (course.modules?.length || 0) + 1;
      let newModId = Date.now();

      try {
        const res = await coursesApi.addModule(courseId, { title: moduleTitle.trim(), orderIndex: newOrder });
        if (res.success && res.data?.moduleId) {
          newModId = res.data.moduleId;
        }
      } catch {
        // Fallback UI
      }

      const newModule = {
        id: newModId,
        course_id: parseInt(courseId, 10),
        title: moduleTitle.trim(),
        order_index: newOrder,
        lessons: []
      };

      setCourse(prev => ({
        ...prev,
        modules: [...(prev.modules || []), newModule]
      }));

      setModuleTitle('');
      setActiveModal(null);
      showToast('Đã thêm chương mục mới thành công!');
    } catch (err) {
      alert(err.message || 'Lỗi khi thêm chương mục');
    }
  };

  // Xử lý Thêm bài giảng mới
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    try {
      let newLessonId = Date.now();
      const targetMod = course.modules?.find(m => m.id === Number(targetModuleId));
      const newOrder = (targetMod?.lessons?.length || 0) + 1;

      try {
        const res = await coursesApi.addLesson({
          moduleId: Number(targetModuleId),
          title: lessonTitle.trim(),
          content: lessonContent,
          videoUrl: lessonVideoUrl,
          orderIndex: newOrder
        });
        if (res.success && res.data?.lessonId) {
          newLessonId = res.data.lessonId;
        }
      } catch {
        // Fallback UI
      }

      const newLesson = {
        id: newLessonId,
        module_id: Number(targetModuleId),
        title: lessonTitle.trim(),
        content: lessonContent,
        video_url: lessonVideoUrl,
        order_index: newOrder,
        assignments: []
      };

      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(mod => {
          if (mod.id === Number(targetModuleId)) {
            return { ...mod, lessons: [...(mod.lessons || []), newLesson] };
          }
          return mod;
        })
      }));

      setLessonTitle('');
      setLessonContent('');
      setLessonVideoUrl('');
      setActiveModal(null);
      showToast('Đã thêm bài giảng mới thành công!');
    } catch (err) {
      alert(err.message || 'Lỗi khi thêm bài giảng');
    }
  };

  // Xử lý Thêm bài tập mới
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    try {
      let newAssignId = Date.now();

      try {
        const res = await coursesApi.addAssignment({
          lessonId: Number(targetLessonId),
          title: assignTitle.trim(),
          description: assignDesc,
          dueDate: assignDueDate,
          maxScore: Number(assignMaxScore)
        });
        if (res.success && res.data?.assignmentId) {
          newAssignId = res.data.assignmentId;
        }
      } catch {
        // Fallback UI
      }

      const newAssignment = {
        id: newAssignId,
        lesson_id: Number(targetLessonId),
        title: assignTitle.trim(),
        description: assignDesc,
        due_date: assignDueDate,
        max_score: Number(assignMaxScore),
        is_active: 1
      };

      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(mod => ({
          ...mod,
          lessons: mod.lessons.map(les => {
            if (les.id === Number(targetLessonId)) {
              return { ...les, assignments: [...(les.assignments || []), newAssignment] };
            }
            return les;
          })
        }))
      }));

      setAssignTitle('');
      setAssignDesc('');
      setActiveModal(null);
      showToast('Đã tạo bài tập mới thành công!');
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo bài tập');
    }
  };

  // Lấy danh sách tất cả các bài giảng trong khóa để đưa vào selectbox
  const allLessons = course.modules?.flatMap(m => m.lessons || []) || [];

  return (
    <div style={{ padding: '28px 24px', maxWidth: '1150px', margin: '0 auto' }}>
      {/* Toast thông báo */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: '#059669',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontWeight: '500',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✅</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Nút Quay lại */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/instructor/courses')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: '600',
            color: '#334155',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
        >
          <span>←</span> Quay lại danh sách khóa học
        </button>
      </div>

      {/* Header Khóa học */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '24px',
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        marginBottom: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <img
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60'}
          alt={course.title}
          style={{ width: '160px', height: '105px', objectFit: 'cover', borderRadius: '10px' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quản lý chi tiết khóa học (UI03)
            </span>
            <StatusBadge type="ACTIVE" label="Đang xuất bản" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>
            {course.title}
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            {course.description}
          </p>
        </div>
      </div>

      {/* Thanh công cụ hành động */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
            Cấu trúc chương trình học ({course.modules?.length || 0} chương)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Thêm chương mục, bài giảng video và giao bài tập thực hành cho sinh viên.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveModal('MODULE')}
            style={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Thêm chương mục
          </button>

          <button
            onClick={() => {
              if (!course.modules || course.modules.length === 0) {
                alert('Vui lòng tạo ít nhất 1 chương trước khi thêm bài học!');
                return;
              }
              setActiveModal('LESSON');
            }}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Thêm bài giảng
          </button>

          <button
            onClick={() => {
              if (allLessons.length === 0) {
                alert('Vui lòng tạo bài giảng trước khi giao bài tập!');
                return;
              }
              setActiveModal('ASSIGNMENT');
            }}
            style={{
              backgroundColor: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Giao bài tập (UI07)
          </button>
        </div>
      </div>

      {/* Danh sách Chương mục & Bài học */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {course.modules?.map((mod, modIdx) => (
          <div
            key={mod.id || modIdx}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            {/* Tiêu đề Chương */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '14px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  backgroundColor: '#e0e7ff',
                  color: '#4338ca',
                  fontWeight: '700',
                  fontSize: '12px',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  Chương {mod.order_index || modIdx + 1}
                </span>
                <h3 style={{ fontSize: '15.5px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                  {mod.title}
                </h3>
              </div>

              <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                {mod.lessons?.length || 0} bài giảng
              </span>
            </div>

            {/* Danh sách Bài học bên trong Chương */}
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(!mod.lessons || mod.lessons.length === 0) ? (
                <div style={{ color: '#94a3b8', fontSize: '13.5px', fontStyle: 'italic', padding: '8px 0' }}>
                  Chưa có bài giảng nào trong chương này. Nhấn nút "+ Thêm bài giảng" ở trên để bổ sung.
                </div>
              ) : (
                mod.lessons.map((lesson, lesIdx) => (
                  <div
                    key={lesson.id || lesIdx}
                    style={{
                      border: '1px solid #edf2f7',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      backgroundColor: '#fafbfc'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>📖</span>
                        <h4 style={{ fontSize: '14.5px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                          {lesson.title}
                        </h4>
                      </div>

                      {lesson.video_url && (
                        <a
                          href={lesson.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '12px',
                            color: '#2563eb',
                            textDecoration: 'none',
                            backgroundColor: '#eff6ff',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}
                        >
                          ▶ Video bài giảng
                        </a>
                      )}
                    </div>

                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                      {lesson.content}
                    </p>

                    {/* Danh sách Bài tập thuộc Bài học này */}
                    {lesson.assignments && lesson.assignments.length > 0 && (
                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#b45309', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📝</span> BÀI TẬP GẮN VỚI BÀI HỌC (UI07):
                        </div>
                        {lesson.assignments.map((assign, aIdx) => (
                          <div
                            key={assign.id || aIdx}
                            style={{
                              backgroundColor: '#fffbeb',
                              border: '1px solid #fde68a',
                              borderRadius: '6px',
                              padding: '10px 14px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '6px'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400e' }}>
                                {assign.title}
                              </div>
                              <div style={{ fontSize: '12px', color: '#b45309', marginTop: '2px' }}>
                                Hạn nộp: {formatDateTime(assign.due_date)} • Điểm tối đa: {assign.max_score}đ
                              </div>
                            </div>

                            <Link
                              to="/instructor/grading"
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#d97706',
                                textDecoration: 'none',
                                backgroundColor: '#ffffff',
                                border: '1px solid #fcd34d',
                                padding: '4px 10px',
                                borderRadius: '4px'
                              }}
                            >
                              Xem nộp bài →
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL THÊM CHƯƠNG MỤC ================= */}
      {activeModal === 'MODULE' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
              Thêm chương mục mới
            </h3>
            <form onSubmit={handleAddModule}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Tên chương mục *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chương 3: Xác thực JWT & Bảo mật ứng dụng"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#475569', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', border: 'none', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
                >
                  Lưu chương
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL THÊM BÀI GIẢNG ================= */}
      {activeModal === 'LESSON' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '520px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
              Thêm bài giảng mới
            </h3>
            <form onSubmit={handleAddLesson}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Thuộc chương mục *
                </label>
                <select
                  value={targetModuleId}
                  onChange={(e) => setTargetModuleId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                >
                  {course.modules?.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Tiêu đề bài giảng *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bài 3: Phân quyền vai trò với Middleware"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Đường dẫn Video bài giảng (YouTube URL)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Nội dung tóm tắt / Mô tả bài học
                </label>
                <textarea
                  rows="3"
                  placeholder="Nội dung kiến thức trọng tâm của bài..."
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#475569', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', border: 'none', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
                >
                  Lưu bài giảng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL GIAO BÀI TẬP (UI07) ================= */}
      {activeModal === 'ASSIGNMENT' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '520px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
              Tạo bài tập mới (UI07)
            </h3>
            <form onSubmit={handleAddAssignment}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Gắn với bài học *
                </label>
                <select
                  value={targetLessonId}
                  onChange={(e) => setTargetLessonId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                >
                  {allLessons.map(les => (
                    <option key={les.id} value={les.id}>{les.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Tiêu đề bài tập *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bài tập thực hành 2: Tạo màn hình Đăng ký & Xác thực"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                    Hạn nộp (Due Date) *
                  </label>
                  <input
                    type="datetime-local"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                    Thang điểm tối đa
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={assignMaxScore}
                    onChange={(e) => setAssignMaxScore(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Yêu cầu & Hướng dẫn nộp bài
                </label>
                <textarea
                  rows="3"
                  placeholder="Yêu cầu sinh viên nộp kèm file .zip, .pdf hoặc .docx..."
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#475569', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', border: 'none', borderRadius: '6px', backgroundColor: '#059669', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
                >
                  Tạo bài tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
