import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request Interceptor: Tự động đính kèm JWT Token vào Header Authorization
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mini_lms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Chuẩn hóa dữ liệu trả về và xử lý phiên đăng nhập hết hạn (401)
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Chỉ xóa token khi token cũ không hợp lệ hoặc đã hết hạn
      const hadToken = !!localStorage.getItem('mini_lms_token');
      localStorage.removeItem('mini_lms_token');
      localStorage.removeItem('mini_lms_user');
      
      // Nếu đang không ở trang login thì chuyển về /login
      if (hadToken && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error.response?.data || { success: false, message: error.message || 'Lỗi kết nối máy chủ' });
  }
);

export default axiosClient;
