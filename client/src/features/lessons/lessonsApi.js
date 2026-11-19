import axiosClient from '../../api/axiosClient';

export const lessonsApi = {
  getLessonsByCourse: async (courseId) => {
    return await axiosClient.get(`/lessons?courseId=${courseId}`);
  }
};

export default lessonsApi;
