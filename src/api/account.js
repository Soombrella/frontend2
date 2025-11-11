// src/api/account.js

/**
 * 계정 관련 로컬 API 모듈
 * (지금은 백엔드 없이 localStorage 기반으로 작동)
 */

/**
 * 비밀번호 확인 후 계정 탈퇴 처리
 * @param {string} password 입력한 비밀번호
 * @returns {Promise<{ok: boolean}>}
 * @throws {Error} INVALID_PASSWORD 비밀번호 불일치 시
 */
export async function deleteAccount(password) {
  // ✅ 실제 서비스에서는 서버로 DELETE /api/account 요청할 부분
  // 지금은 로컬 로그인 저장값을 확인하는 예시로 대체
  const stored = localStorage.getItem("sb_auth_pw");

  if (!stored || stored !== String(password)) {
    const err = new Error("INVALID_PASSWORD");
    err.status = 401;
    throw err;
  }

  // 계정 관련 로컬 데이터 제거
  localStorage.removeItem("sb_auth_pw"); // 비밀번호
  localStorage.removeItem("sb_user");    // 사용자 정보
  localStorage.removeItem("sb_token");   // 로그인 토큰
  localStorage.removeItem("sb_rents");   // 대여 기록 (선택적)

  return { ok: true };
}

/**
 * 임시: 로컬 스토리지에 사용자 정보 업데이트
 * (백엔드 연동 시 PUT /api/account 등으로 대체 가능)
 */
export async function updateAccountProfile(data) {
  const user = JSON.parse(localStorage.getItem("sb_user") || "{}");
  const next = { ...user, ...data };
  localStorage.setItem("sb_user", JSON.stringify(next));
  return next;
}

/**
 * 임시: 비밀번호 변경
 * (현재는 단순히 로컬 스토리지에서 교체만 함)
 */
export async function changePassword(oldPw, newPw) {
  const stored = localStorage.getItem("sb_auth_pw");

  if (!stored || stored !== String(oldPw)) {
    const err = new Error("INVALID_PASSWORD");
    err.status = 401;
    throw err;
  }

  localStorage.setItem("sb_auth_pw", String(newPw));
  return { ok: true };
}
