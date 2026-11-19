import axiosClient from '../../api/axiosClient';

export const assignmentsApi = {
  getAssignmentDetail: async (id) => {
    return await axiosClient.get(`/assignments/${id}`);
  },

  submitAssignment: async (id, submissionData) => {
    return await axiosClient.post(`/assignments/${id}/submit`, submissionData);
  }
};

export default assignmentsApi;
