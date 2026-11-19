const assignmentsService = require('./assignments.service');
const { isValidSubmissionFile, isAssignmentPastDue } = require('../../utils/validators');

async function getAssignmentDetail(req, res, next) {
  try {
    const { id } = req.params;
    const assignment = await assignmentsService.findAssignmentById(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài tập'
      });
    }
    return res.status(200).json({
      success: true,
      data: assignment,
      message: 'Lấy thông tin bài tập thành công'
    });
  } catch (error) {
    next(error);
  }
}

async function submitAssignment(req, res, next) {
  try {
    const { id } = req.params;
    const { selectedAnswer, fileName, fileUrl } = req.body;
    const studentId = req.user.id;

    const assignment = await assignmentsService.findAssignmentById(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài tập'
      });
    }

    if (!assignment.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Bài tập này hiện đã đóng'
      });
    }

    if (fileName && !isValidSubmissionFile(fileName)) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng file không hợp lệ. Chỉ chấp nhận .zip, .rar, .pdf, .docx, .txt'
      });
    }

    const isLate = isAssignmentPastDue(assignment.due_date);
    const submitStatus = isLate ? 'LATE' : 'ON_TIME';

    const submissionId = await assignmentsService.createSubmission({
      assignmentId: id,
      studentId,
      selectedAnswer,
      fileName,
      fileUrl,
      submittedAt: new Date(),
      submitStatus
    });

    return res.status(201).json({
      success: true,
      message: isLate ? 'Nộp bài thành công (Nộp muộn)' : 'Nộp bài thành công đúng hạn',
      data: { submissionId, submitStatus }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAssignmentDetail,
  submitAssignment
};
