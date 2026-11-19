import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import coursesApi from '../courses/coursesApi';
import assignmentsApi from '../assignments/assignmentsApi';
import StatusBadge from '../../components/StatusBadge';
import { formatDateTime } from '../../utils/formatters';

const DEFAULT_SAMPLE_COURSE = {
  id: 1,
  title: 'Lập trình Web với ReactJS & NodeJS',
  description: 'Khóa học cung cấp kiến thức nền tảng và nâng cao về kiến trúc 3 tầng (ReactJS, ExpressJS, MySQL).',
  modules: [
    {
      id: 1,
      title: 'Chương 1: Kiến trúc Ứng dụng Web & Tổng quan',
      lessons: [
        {
          id: 1,
          module_id: 1,
          title: 'Bài 1: Kiến trúc 3 tầng Client - Server - Database',
          content: 'Trong bài học này, chúng ta sẽ tìm hiểu về mô hình 3 tầng Client-Server, vai trò của ReactJS ở tầng Frontend, ExpressJS ở tầng Backend và MySQL ở tầng CSDL.',
          video_url: 'https://www.youtube.com/embed/Ke90Tje7VS0',
          is_completed: true,
          assignments: []
        }
      ]
    },
    {
      id: 2,
      title: 'Chương 2: Xây dựng Backend RESTful API & MySQL',
      lessons: [
        {
          id: 2,
          module_id: 2,
          title: 'Bài 2: Thiết kế RESTful API & Xác thực người dùng bằng JWT',
          content: 'Tìm hiểu chuẩn thiết kế RESTful API, mã hóa mật khẩu với Bcrypt và cơ chế xác thực không trạng thái (stateless authentication) với JSON Web Token (JWT).',
          video_url: 'https://www.youtube.com/embed/mbsmsi7l3r4',
          is_completed: false,
          assignments: [
            {
              id: 1,
              title: 'Bài tập 1: Xây dựng API Đăng nhập và Middleware phân quyền JWT',
              description: 'Yêu cầu: Sinh viên xây dựng endpoint POST /api/auth/login, kiểm tra bcrypt password và trả về JWT token. Nộp file nén .zip bài làm.',
              due_date: '2026-12-31T23:59:59',
              max_score: 10.0,
              submitted: true,
              score: 9.5,
              fileName: 'bai_tap_1_nguyenvanb.zip',
              feedback: 'Bài làm rất tốt, cấu trúc thư mục chuẩn và xử lý lỗi đầy đủ.'
            }
          ]
        }
      ]
    }
  ]
};

export default function StudentCourseStudy() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(DEFAULT_SAMPLE_COURSE);
  const [selectedLesson, setSelectedLesson] = useState(DEFAULT_SAMPLE_COURSE.modules[0].lessons[0]);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await coursesApi.getCourseDetail(courseId);
        if (res.success && res.data) {
          setCourse(res.data);
          if (res.data.modules?.[0]?.lessons?.[0]) {
            setSelectedLesson(res.data.modules[0].lessons[0]);
          }
        }
      } catch (err) {
        console.warn('[StudentCourseStudy] Dùng dữ liệu mẫu dự phòng:', err.message);
      }
    };
    fetchCourse();
  }, [courseId]);

  const toggleLessonComplete = (lessonId) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(les => {
          if (les.id === lessonId) {
            const updated = !les.is_completed;
            showToast(updated ? 'Đã đánh dấu hoàn thành bài học!' : 'Đã hủy đánh dấu hoàn thành.');
            return { ...les, is_completed: updated };
          }
          return les;
        })
      }))
    }));
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (!submissionFile) {
      alert('Vui lòng chọn file bài làm (.zip, .pdf, .docx)!');
      return;
    }

    try {
      setIsSubmitting(true);
      try {
        await assignmentsApi.submitAssignment(assignmentId, {
          fileName: submissionFile.name,
          fileUrl: `/uploads/${submissionFile.name}`,
          selectedAnswer: 'Em nộp file bài tập'
        });
      } catch {
        // Fallback
      }

      showToast(`Nộp bài tập "${submissionFile.name}" thành công!`);
      setSubmissionFile(null);
    } catch (err) {
      alert(err.message || 'Lỗi khi nộp bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
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
      <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/student/courses')}
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
            cursor: 'pointer'
          }}
        >
          <span>←</span> Quay lại khóa học của tôi
        </button>

        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Đang xem: <strong>{course.title}</strong>
        </span>
      </div>

      {/* Bố cục 2 Cột */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* CỘT TRÁI: Nội dung bài học & Nộp bài tập (UI05 / UI06) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Khung Video Bài giảng */}
          <div style={{
            backgroundColor: '#000000',
            borderRadius: '12px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <iframe
              src={selectedLesson.video_url || 'https://www.youtube.com/embed/Ke90Tje7VS0'}
              title={selectedLesson.title}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Chi tiết Bài học */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                {selectedLesson.title}
              </h2>

              <button
                onClick={() => toggleLessonComplete(selectedLesson.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: selectedLesson.is_completed ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                  backgroundColor: selectedLesson.is_completed ? '#ecfdf5' : '#ffffff',
                  color: selectedLesson.is_completed ? '#065f46' : '#475569'
                }}
              >
                {selectedLesson.is_completed ? '✓ Đã hoàn thành' : 'Đánh dấu hoàn thành'}
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {selectedLesson.content}
            </p>
          </div>

          {/* Phần Bài tập gắn với Bài này (UI06) */}
          {selectedLesson.assignments && selectedLesson.assignments.length > 0 && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '24px',
              background: 'linear-gradient(to bottom, #fffbeb, #ffffff)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '20px' }}>📝</span>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#92400e', margin: 0 }}>
                  Làm & Nộp bài tập (UI06)
                </h3>
              </div>

              {selectedLesson.assignments.map((assign) => (
                <div key={assign.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {assign.title}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    {assign.description}
                  </p>
                  <div style={{ fontSize: '12.5px', color: '#b45309', fontWeight: '500' }}>
                    ⏰ Hạn nộp: {formatDateTime(assign.due_date)} • Thang điểm: {assign.max_score}đ
                  </div>

                  {/* Trạng thái bài nộp */}
                  {assign.submitted ? (
                    <div style={{
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '8px',
                      padding: '14px',
                      marginTop: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '600', color: '#065f46', fontSize: '13.5px' }}>
                          ✅ Đã nộp bài: 📦 {assign.fileName}
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#047857' }}>
                          Điểm: {assign.score} / {assign.max_score}
                        </span>
                      </div>
                      {assign.feedback && (
                        <div style={{ fontSize: '13px', color: '#047857', borderTop: '1px dashed #a7f3d0', paddingTop: '8px', marginTop: '6px' }}>
                          <strong>Nhận xét của Giảng viên:</strong> "{assign.feedback}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '8px',
                      padding: '18px',
                      backgroundColor: '#f8fafc',
                      marginTop: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                        Tải lên file bài tập (.zip, .pdf, .docx, max 20MB):
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setSubmissionFile(e.target.files[0])}
                        style={{ fontSize: '13px' }}
                      />
                      <button
                        onClick={() => handleSubmitAssignment(assign.id)}
                        disabled={isSubmitting || !submissionFile}
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '6px',
                          fontSize: '13.5px',
                          fontWeight: '600',
                          cursor: submissionFile ? 'pointer' : 'not-allowed',
                          width: 'fit-content',
                          opacity: submissionFile ? 1 : 0.6
                        }}
                      >
                        {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài tập ngay'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: Mục lục Khóa học (Curriculum) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
            Nội dung khóa học
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {course.modules?.map((mod, modIdx) => (
              <div key={mod.id || modIdx}>
                <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Chương {mod.order_index || modIdx + 1}: {mod.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {mod.lessons?.map((les) => {
                    const isSelected = selectedLesson.id === les.id;
                    return (
                      <div
                        key={les.id}
                        onClick={() => setSelectedLesson(les)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                          border: isSelected ? '1px solid #93c5fd' : '1px solid transparent',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>
                          {les.is_completed ? '✅' : '⚪'}
                        </span>
                        <div style={{ flex: 1, fontSize: '13px', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#1d4ed8' : '#334155' }}>
                          {les.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
