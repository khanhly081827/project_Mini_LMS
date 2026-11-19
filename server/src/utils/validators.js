/**
 * Kiểm tra định dạng Email hợp lệ
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
}

/**
 * Kiểm tra phần mở rộng file nộp bài hợp lệ (.zip, .rar, .pdf, .docx, .txt)
 */
function isValidSubmissionFile(fileName) {
  if (!fileName || typeof fileName !== 'string') return false;
  const allowedExtensions = ['.zip', '.rar', '.pdf', '.docx', '.txt'];
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  return allowedExtensions.includes(ext);
}

/**
 * Kiểm tra hạn nộp bài tập (due_date) so với thời điểm hiện tại
 */
function isAssignmentPastDue(dueDate) {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  return now > due;
}

module.exports = {
  isValidEmail,
  isValidSubmissionFile,
  isAssignmentPastDue
};
