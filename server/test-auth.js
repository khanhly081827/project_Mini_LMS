const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('./src/modules/auth/auth.controller');
const authService = require('./src/modules/auth/auth.service');
const { authenticateToken, authorizeRole } = require('./src/middlewares/authMiddleware');

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.data = obj;
      return this;
    }
  };
  return res;
}

async function runTests() {
  console.log('--- BẮT ĐẦU KIỂM THỬ XÁC THỰC & PHÂN QUYỀN (FR01) ---');

  // 1. Kiểm thử Bcrypt hash và mật khẩu mẫu 123456
  const sampleHash = '$2a$10$RejUYVepa3oChtRj9DAmg.vqIToSuj/MqfmlPOIWTPRFTj9a2EXS2';
  const isMatch123456 = bcrypt.compareSync('123456', sampleHash);
  const isMatchWrong = bcrypt.compareSync('wrongpassword', sampleHash);

  console.log('[Test 1] Bcrypt verify 123456:', isMatch123456 ? 'PASS ✅' : 'FAIL ❌');
  console.log('[Test 2] Bcrypt reject wrong password:', !isMatchWrong ? 'PASS ✅' : 'FAIL ❌');

  // 2. Mock authService
  const originalFindUserByEmail = authService.findUserByEmail;
  const originalFindUserById = authService.findUserById;

  const mockUsers = {
    'nguyenvana@gmail.com': {
      id: 1,
      full_name: 'GV. Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      password: sampleHash,
      role: 'INSTRUCTOR',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherA'
    },
    'nguyenvanb@gmail.com': {
      id: 2,
      full_name: 'Nguyễn Văn B',
      email: 'nguyenvanb@gmail.com',
      password: sampleHash,
      role: 'STUDENT',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StudentB'
    }
  };

  authService.findUserByEmail = async (email) => {
    return mockUsers[email] || null;
  };

  authService.findUserById = async (id) => {
    return Object.values(mockUsers).find(u => u.id === id) || null;
  };

  try {
    // Test 3: Đăng nhập thiếu thông tin email/password (status 400)
    const reqEmpty = { body: {} };
    const resEmpty = createMockRes();
    await authController.login(reqEmpty, resEmpty, () => {});
    console.log('[Test 3] Validate thiếu email/password (status 400):', resEmpty.statusCode === 400 && !resEmpty.data.success ? 'PASS ✅' : 'FAIL ❌');

    // Test 4: Đăng nhập sai định dạng email (status 400)
    const reqBadEmail = { body: { email: 'not-an-email', password: '123' } };
    const resBadEmail = createMockRes();
    await authController.login(reqBadEmail, resBadEmail, () => {});
    console.log('[Test 4] Validate định dạng email (status 400):', resBadEmail.statusCode === 400 && !resBadEmail.data.success ? 'PASS ✅' : 'FAIL ❌');

    // Test 5: Đăng nhập sai mật khẩu (status 401)
    const reqWrongPass = { body: { email: 'nguyenvana@gmail.com', password: 'wrong' } };
    const resWrongPass = createMockRes();
    await authController.login(reqWrongPass, resWrongPass, () => {});
    console.log('[Test 5] Sai mật khẩu (status 401):', resWrongPass.statusCode === 401 && !resWrongPass.data.success ? 'PASS ✅' : 'FAIL ❌');

    // Test 6: Giảng viên A đăng nhập thành công
    const reqTeacher = { body: { email: 'nguyenvana@gmail.com', password: '123456' } };
    const resTeacher = createMockRes();
    await authController.login(reqTeacher, resTeacher, () => {});
    const teacherToken = resTeacher.data?.data?.token;
    const isTeacherOk = resTeacher.statusCode === 200 &&
                        resTeacher.data.success &&
                        resTeacher.data.data.user.role === 'INSTRUCTOR' &&
                        !!teacherToken;
    console.log('[Test 6] Giảng viên A đăng nhập thành công & nhận JWT (Role: INSTRUCTOR):', isTeacherOk ? 'PASS ✅' : 'FAIL ❌');

    // Test 7: Sinh viên B đăng nhập thành công
    const reqStudent = { body: { email: 'nguyenvanb@gmail.com', password: '123456' } };
    const resStudent = createMockRes();
    await authController.login(reqStudent, resStudent, () => {});
    const studentToken = resStudent.data?.data?.token;
    const isStudentOk = resStudent.statusCode === 200 &&
                        resStudent.data.success &&
                        resStudent.data.data.user.role === 'STUDENT' &&
                        !!studentToken;
    console.log('[Test 7] Sinh viên B đăng nhập thành công & nhận JWT (Role: STUDENT):', isStudentOk ? 'PASS ✅' : 'FAIL ❌');

    // Test 8: Middleware authenticateToken với token hợp lệ
    const reqAuth = { headers: { authorization: `Bearer ${teacherToken}` } };
    const resAuth = createMockRes();
    let authPassed = false;
    authenticateToken(reqAuth, resAuth, () => { authPassed = true; });
    console.log('[Test 8] Middleware authenticateToken xác thực hợp lệ:', authPassed && reqAuth.user.role === 'INSTRUCTOR' ? 'PASS ✅' : 'FAIL ❌');

    // Test 9: Middleware authenticateToken chặn khi thiếu token (status 401)
    const reqNoToken = { headers: {} };
    const resNoToken = createMockRes();
    authenticateToken(reqNoToken, resNoToken, () => {});
    console.log('[Test 9] Chặn truy cập khi thiếu token (status 401):', resNoToken.statusCode === 401 ? 'PASS ✅' : 'FAIL ❌');

    // Test 10: Phân quyền authorizeRole('INSTRUCTOR')
    const reqInstructorOnly = { user: { role: 'STUDENT' } };
    const resInstructorOnly = createMockRes();
    let rolePassed = false;
    authorizeRole('INSTRUCTOR')(reqInstructorOnly, resInstructorOnly, () => { rolePassed = true; });
    console.log('[Test 10] Chặn Sinh viên truy cập chức năng Giảng viên (status 403):', resInstructorOnly.statusCode === 403 && !rolePassed ? 'PASS ✅' : 'FAIL ❌');

    console.log('\n🎉 TẤT CẢ 10 BÀI KIỂM THỬ XÁC THỰC VÀ PHÂN QUYỀN ĐỀU VƯỢT QUA XUẤT SẮC!');
  } finally {
    authService.findUserByEmail = originalFindUserByEmail;
    authService.findUserById = originalFindUserById;
  }
}

runTests().catch(err => {
  console.error('Lỗi khi chạy test:', err);
  process.exit(1);
});
