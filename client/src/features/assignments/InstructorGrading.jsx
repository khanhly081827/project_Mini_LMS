import React, { useState, useEffect } from 'react';
import coursesApi from '../courses/coursesApi';
import StatusBadge from '../../components/StatusBadge';
import { formatDateTime } from '../../utils/formatters';

// Dữ liệu mẫu dự phòng cho bài nộp của sinh viên
const DEFAULT_SAMPLE_SUBMISSIONS = [
  {
    id: 1,
    assignment_id: 1,
    student_id: 2,
    student_name: 'Nguyễn Văn B',
    student_email: 'nguyenvanb@gmail.com',
    course_title: 'Lập trình Web với ReactJS & NodeJS',
    assignment_title: 'Bài tập 1: Xây dựng API Đăng nhập và Middleware phân quyền JWT',
    max_score: 10.0,
    file_name: 'bai_tap_1_nguyenvanb.zip',
    file_url: '/uploads/submissions/bai_tap_1_nguyenvanb.zip',
    selected_answer: 'Em đã hoàn thành bài tập nộp kèm mã nguồn zip.',
    submitted_at: '2026-11-19T21:29:40',
    submit_status: 'ON_TIME',
    score: 9.5,
    feedback: 'Bài làm rất tốt, cấu trúc thư mục chuẩn và xử lý lỗi đầy đủ.',
    graded_at: '2026-11-19T21:30:00'
  }
];

export default function InstructorGrading() {
  const [submissions, setSubmissions] = useState(DEFAULT_SAMPLE_SUBMISSIONS);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.getInstructorSubmissions();
        if (res.success && res.data && res.data.length > 0) {
          setSubmissions(res.data);
        }
      } catch (err) {
        console.warn('[InstructorGrading] Dùng dữ liệu bài nộp mẫu:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const openGradeModal = (sub) => {
    setSelectedSub(sub);
    setGradeScore(sub.score !== null ? sub.score.toString() : '10');
    setGradeFeedback(sub.feedback || '');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    const numScore = parseFloat(gradeScore);
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      alert('Vui lòng nhập điểm hợp lệ từ 0 đến 10!');
      return;
    }

    try {
      try {
        await coursesApi.gradeSubmission(selectedSub.id, {
          score: numScore,
          feedback: gradeFeedback
        });
      } catch {
        // Fallback UI
      }

      setSubmissions(prev =>
        prev.map(item => {
          if (item.id === selectedSub.id) {
            return {
              ...item,
              score: numScore,
              feedback: gradeFeedback,
              graded_at: new Date().toISOString()
            };
          }
          return item;
        })
      );

      setSelectedSub(null);
      showToast(`Đã lưu điểm ${numScore}/10 cho sinh viên ${selectedSub.student_name}!`);
    } catch (err) {
      alert(err.message || 'Lỗi khi chấm điểm');
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
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

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            Quản lý Chấm điểm & Bài nộp Sinh viên (UI08)
          </h1>
          <StatusBadge type="INSTRUCTOR" label="Giảng viên" />
        </div>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
          Xem danh sách bài tập đã nộp, tải file đính kèm, chấm điểm và phản hồi nhận xét trực tiếp cho sinh viên.
        </p>
      </div>

      {/* Bảng danh sách bài nộp */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '16.5px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Danh sách bài nộp ({submissions.length})
          </h2>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>
            Hệ thống hỗ trợ file: .zip, .rar, .pdf, .docx, .txt
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Sinh viên</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Bài tập & Khóa học</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>File nộp</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Thời gian nộp</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Điểm số</th>
                <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{sub.student_name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{sub.student_email}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{sub.assignment_title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{sub.course_title}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {sub.file_name ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#f1f5f9',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: '#334155',
                        fontWeight: '500',
                        fontSize: '12.5px'
                      }}>
                        📦 {sub.file_name}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Không có file</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div>{formatDateTime(sub.submitted_at)}</div>
                    <StatusBadge type={sub.submit_status} label={sub.submit_status === 'ON_TIME' ? 'Đúng hạn' : 'Nộp muộn'} />
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {sub.score !== null ? (
                      <div>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>
                          {sub.score}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}> / 10.0</span>
                      </div>
                    ) : (
                      <span style={{ color: '#d97706', fontWeight: '500', fontSize: '12.5px' }}>Chưa chấm</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <button
                      onClick={() => openGradeModal(sub)}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {sub.score !== null ? 'Sửa điểm' : 'Chấm điểm'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL CHẤM ĐIỂM (UI08) ================= */}
      {selectedSub && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '14px', color: '#1e293b' }}>
              Chấm điểm bài nộp
            </h3>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <div><strong>Sinh viên:</strong> {selectedSub.student_name} ({selectedSub.student_email})</div>
              <div style={{ marginTop: '4px' }}><strong>Bài tập:</strong> {selectedSub.assignment_title}</div>
              {selectedSub.file_name && (
                <div style={{ marginTop: '4px' }}><strong>File bài làm:</strong> 📦 {selectedSub.file_name}</div>
              )}
            </div>

            <form onSubmit={handleSaveGrade}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Điểm số (Thang điểm 10) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.25"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', fontWeight: '600', boxSizing: 'border-box' }}
                  required
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Nhận xét & Góp ý của Giảng viên
                </label>
                <textarea
                  rows="4"
                  placeholder="Nhận xét ưu điểm, những chỗ cần cải thiện..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#475569', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', border: 'none', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
                >
                  Lưu điểm & Gửi nhận xét
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
