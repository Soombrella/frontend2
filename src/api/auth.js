// src/api/auth.js
const BASE = process.env.REACT_APP_API_BASE_URL;

export async function loginApi(student_no, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ student_no, password }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // 백엔드 응답 message 우선 사용
    const msg = json?.message || "로그인에 실패했습니다.";
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  // 명세: { success, message, data: { ... , token } }
  const data = json?.data;
  if (!data?.token) {
    throw new Error("로그인 응답에 token이 없습니다.");
  }

  return {
    token: data.token,
    user: {
      member_id: data.member_id,
      username: data.student_no,     // ✅ 프론트는 username으로 통일
      name: data.name,
      dept: data.department,
      email: data.email,
      is_admin: data.is_admin,
    },
  };
}