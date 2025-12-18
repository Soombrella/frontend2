// src/api/auth.js
const BASE = process.env.REACT_APP_API_BASE_URL || "";

/** -------------------------
 * 공통: 응답 파싱/에러 처리
 * ------------------------- */
async function readJsonOrText(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function makeHttpError(res, json) {
  const msg =
    json?.message ||
    (res.status >= 500
      ? "서버 오류가 발생했습니다."
      : "요청에 실패했습니다.");
  const err = new Error(msg);
  err.status = res.status;
  err.body = json;
  return err;
}

async function postJson(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const json = await readJsonOrText(res);
  if (!res.ok) throw makeHttpError(res, json);
  return json;
}

/** -------------------------
 * 로그인 (POST /auth/login)
 * Request: { student_no, password }
 * Response: { success, message, data: { token, member_id, student_no, name, department, email, is_admin } }
 * ------------------------- */
export async function loginApi(student_no, password) {
  const json = await postJson("/auth/login", { student_no, password });

  const data = json?.data;
  if (!data?.token) throw new Error("로그인 응답에 token이 없습니다.");

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

/** -------------------------
 * 회원가입 (POST /auth/register)
 * ------------------------- */
export async function signupApi(payload) {
  // 스웨거에 /auth/register, 노션에 /auth/signup 같이 보일 수도 있어서
  // 우선 register로 시도하고 404/405면 signup으로 재시도 (둘 다 "네가 준 후보"일 때만)
  try {
    return await postJson("/auth/register", payload);
  } catch (e) {
    if (e?.status === 404 || e?.status === 405) {
      return await postJson("/auth/signup", payload);
    }
    throw e;
  }
}

/** -------------------------
 * 비밀번호 찾기 - 인증번호 요청
 * 후보 엔드포인트(네가 준 것들만):
 * 1) POST /auth/find-pw/request   (스웨거)
 * 2) POST /auth/password/email   (노션)
 * Request: { email }
 * ------------------------- */
export async function findPwRequestApi(email) {
  const body = { email };

  // 1) 스웨거
  try {
    return await postJson("/auth/find-pw/request", body);
  } catch (e) {
    // 404/405면 다른 후보로 폴백
    if (e?.status === 404 || e?.status === 405) {
      return await postJson("/auth/password/email", body);
    }
    // 500이면 서버 문제라 폴백해도 의미 없지만, 혹시 엔드포인트만 다른 경우 대비해 폴백도 한 번 더
    try {
      return await postJson("/auth/password/email", body);
    } catch {
      throw e;
    }
  }
}

/** -------------------------
 * 비밀번호 찾기 - 인증번호 검증
 * 후보 엔드포인트(네가 준 것들만):
 * 1) POST /auth/find-pw/verify    (스웨거)
 * 2) POST /auth/password/verify   (노션)
 * Request: { email, code }
 * ------------------------- */
export async function findPwVerifyApi(email, code) {
  const body = { email, code };

  // 1) 스웨거
  try {
    return await postJson("/auth/find-pw/verify", body);
  } catch (e) {
    if (e?.status === 404 || e?.status === 405) {
      return await postJson("/auth/password/verify", body);
    }
    try {
      return await postJson("/auth/password/verify", body);
    } catch {
      throw e;
    }
  }
}