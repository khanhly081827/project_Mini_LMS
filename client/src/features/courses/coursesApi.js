import axiosClient from '../../api/axiosClient';

export const coursesApi = {
  // Lấy toàn bộ khóa học
  getAllCourses: async () => {
    return await axiosClient.get('/courses');
  },

  // Lấy chi tiết khóa học kèm danh sách chương, bài học và bài tập
  getCourseDetail: async (courseId) => {
    return await axiosClient.get(`/courses/${courseId}`);
  },

  // Thêm chương mục mới (Giảng viên)
  addModule: async (courseId, data) => {
    return await axiosClient.post(`/courses/${courseId}/modules`, data);
  },

  // Thêm bài giảng mới (Giảng viên)
  addLesson: async (data) => {
    return await axiosClient.post('/courses/lessons', data);
  },

  // Thêm bài tập mới (Giảng viên)
  addAssignment: async (data) => {
    return await axiosClient.post('/courses/assignments', data);
  },

  // Lấy danh sách bài nộp cần chấm của sinh viên (Giảng viên)
  getInstructorSubmissions: async () => {
    return await axiosClient.get('/courses/instructor/submissions');
  },

  // Chấm điểm bài nộp (Giảng viên)
  gradeSubmission: async (submissionId, data) => {
    return await axiosClient.put(`/courses/submissions/${submissionId}/grade`, data);
  }
};

export default coursesApi;
