// src/lib/fakeAuth.js
// 절대 운영용 금지! 개발/디자인 확인용 로컬 인증.
const USERS_KEY = 'sb_users';

const load = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const save = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));

// ✅ 학번(아이디) 중복확인용 별도 함수는 제거함
//    - UI에서 "중복확인" 버튼은 사용하지 않고
//    - 회원가입 시점에만 중복 체크를 수행

// 회원가입
export function signup({ username, password, name, email, dept, birth, account, phone }) {
  const users = load();

  // 여기에서만 중복 방어 (실제 백엔드에서도 이런 식으로 처리할 예정)
  if (users.some(u => u.username === username)) {
    throw new Error('이미 사용 중인 아이디입니다.');
  }

  const user = { username, password, name, email, dept, birth, account, phone };
  users.push(user);
  save(users);

  // 자동 로그인용 결과 (password 제거)
  const safeUser = { ...user }; 
  delete safeUser.password;
  return { token: `dev-${Date.now()}`, user: safeUser };
}

// 로그인
export function loginLocal(username, password) {
  const users = load();
  const u = users.find(u => u.username === username && u.password === password);
  if (!u) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  const safeUser = { ...u }; 
  delete safeUser.password;
  return { token: `dev-${Date.now()}`, user: safeUser };
}

/* ========================================
   ✏️ 프로필/비밀번호/회원탈퇴용 로컬 API
   (나중에 백엔드 붙이면 여기만 교체)
   ======================================== */

// 프로필 수정: email, dept 등 patch 반영
export function updateProfileLocal(username, patch) {
  const users = load();
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) throw new Error('사용자를 찾을 수 없습니다.');

  const updated = { ...users[idx], ...patch };
  users[idx] = updated;
  save(users);

  // 현재 로그인 사용자(localStorage sb_user)도 같이 갱신
  const rawCurrent = localStorage.getItem('sb_user');
  if (rawCurrent) {
    try {
      const current = JSON.parse(rawCurrent);
      if (current.username === username) {
        const safeUser = { ...updated };
        delete safeUser.password;
        localStorage.setItem('sb_user', JSON.stringify(safeUser));
      }
    } catch {
      // 깨져 있으면 그냥 무시
    }
  }
}

// 비밀번호 변경
export function changePasswordLocal(username, oldPw, newPw) {
  const users = load();
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) throw new Error('사용자를 찾을 수 없습니다.');

  if (users[idx].password !== oldPw) {
    throw new Error('기존 비밀번호가 일치하지 않습니다.');
  }

  users[idx] = { ...users[idx], password: newPw };
  save(users);
}

// 회원탈퇴: 현재 로그인 정보 + 비밀번호 확인 후 삭제
export function deleteAccountLocal(password) {
  const rawCurrent = localStorage.getItem('sb_user');
  if (!rawCurrent) {
    throw new Error('로그인 정보가 없습니다.');
  }

  let current;
  try {
    current = JSON.parse(rawCurrent);
  } catch {
    throw new Error('로그인 정보가 손상되었습니다.');
  }

  const users = load();
  const u = users.find(u => u.username === current.username);
  if (!u) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  if (u.password !== password) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  const nextUsers = users.filter(user => user.username !== current.username);
  save(nextUsers);

  // 로그인 정보 제거
  localStorage.removeItem('sb_user');
  localStorage.removeItem('sb_token');
}