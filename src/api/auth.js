// src/api/auth.js
const BASE = process.env.REACT_APP_API_BASE_URL;

/* =========================
   로그인 (POST /auth/login)
========================= */
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
    const msg = json?.message || "로그인에 실패했습니다.";
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  const data = json?.data;
  if (!data?.token) {
    throw new Error("로그인 응답에 token이 없습니다.");
  }

  return {
    token: data.token,
    user: {
      member_id: data.member_id,
      username: data.student_no,
      name: data.name,
      dept: data.department,
      email: data.email,
      is_admin: data.is_admin,
    },
  };
}

/* =========================
   회원가입 (POST /auth/register)
========================= */
export async function signupApi(payload) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      json?.message ||
      (res.status === 409
        ? "이미 존재하는 학번 또는 이메일입니다."
        : "회원가입에 실패했습니다.");

    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json; // { success, message, data }
}

/* =========================
   비밀번호 찾기 - 인증번호 요청
   POST /auth/find-pw/request
   Request: { email }
========================= */
export async function findPwRequestApi(email) {
  const res = await fetch(`${BASE}/auth/find-pw/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.message || "인증번호 요청에 실패했습니다.";
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json; // { success, message }
}

/* =========================
   비밀번호 찾기 - 인증번호 검증
   POST /auth/find-pw/verify
   Request: { email, code }
========================= */
export async function findPwVerifyApi(email, code) {
  const res = await fetch(`${BASE}/auth/find-pw/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.message || "인증번호 검증에 실패했습니다.";
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json; // { success, message }
}