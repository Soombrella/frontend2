// 절대 운영용 금지! 개발/디자인 확인용 로컬 인증.
const USERS_KEY = 'sb_users';

const load = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const save = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));

// 아이디(학번) 중복확인
export function checkId(username) {
  const users = load();
  return !users.some(u => u.username === username);
}

// 회원가입
export function signup({ username, password, name, email, dept, birth, account, phone }) {
  const users = load();
  if (users.some(u => u.username === username)) {
    throw new Error('이미 사용 중인 아이디입니다.');
  }
  const user = { username, password, name, email, dept, birth, account, phone };
  users.push(user);
  save(users);
  // 자동 로그인용 결과
  const safeUser = { ...user }; delete safeUser.password;
  return { token: `dev-${Date.now()}`, user: safeUser };
}

// 로그인
export function loginLocal(username, password) {
  const users = load();
  const u = users.find(u => u.username === username && u.password === password);
  if (!u) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  const safeUser = { ...u }; delete safeUser.password;
  return { token: `dev-${Date.now()}`, user: safeUser };
}
