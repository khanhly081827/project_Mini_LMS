import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom Hook truy cập trạng thái xác thực và phân quyền
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}

export default useAuth;
