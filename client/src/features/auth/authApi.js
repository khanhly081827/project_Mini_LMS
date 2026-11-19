import axiosClient from '../../api/axiosClient';

/**
 * Các hàm gọi API liên quan đến Xác thực & Phân quyền (FR01)
 */
export const authApi = {
  /**
   * Gọi API đăng nhập hệ thống
   * @param {Object} credentials - { email, password }
   * @returns {Promise<{ success: boolean, message: string, data: { token: string, user: Object } }>}
   */
  login: async (credentials) => {
    return await axiosClient.post('/auth/login', credentials);
  },

  /**
   * Lấy thông tin tài khoản hiện tại từ token đã lưu
   * @returns {Promise<{ success: boolean, message: string, data: { user: Object } }>}
   */
  getMe: async () => {
    return await axiosClient.get('/auth/me');
  }
};

export default authApi;
