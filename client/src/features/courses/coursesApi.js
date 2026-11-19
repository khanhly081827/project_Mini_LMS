import axiosClient from '../../api/axiosClient';

export const coursesApi = {
  getAllCourses: async () => {
    return await axiosClient.get('/courses');
  }
};

export default coursesApi;
