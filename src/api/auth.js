// src/api/auth.js
import axios from "axios";

export const TOKEN_KEY = "sb_token";
export const USER_KEY = "sb_user";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://13.48.133.70:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ======================
 *  Utils
 * ====================== */

// FastAPI / Pydantic 에러(detail: [{loc,msg,type,input}])까지 문자열로 정리
function normalizeErrorMessage(data, fallback = "요청 중 오류가 발생했습니다.") {
  if (!data) return fallback;

  // 1) detail이 문자열
  if (typeof data.detail === "string") return data.detail;

  // 2) detail이 배열 (pydantic validation error)
  if (Array.isArray(data.detail)) {
    const msgs = data.detail
      .map((d) => {
        if (!d) return null;
        if (typeof d === "string") return d;
        if (typeof d.msg === "string") return d.msg;
        return JSON.stringify(d);
      })
      .filter(Boolean);

    if (msgs.length) return msgs.join("\n");
  }

  // 3) message 필드
  if (typeof data.message === "string") return data.message;

  // 4) 그 외 객체면 stringify
  try {
    return JSON.stringify(data);
  } catch {
    return fallback;
  }
}

/* ======================
 *  Interceptors
 * ====================== */

// 요청마다 JWT 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 공통 에러 처리: err.message를 "항상 문자열"로 보장
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data;

    const msg =
      normalizeErrorMessage(data, null) ||
      (typeof err?.message === "string" ? err.message : null) ||
      "요청 중 오류가 발생했습니다.";

    // 401이면 로컬 토큰/유저 제거
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    // ✅ React에서 안전하게 쓰도록 "Error"로 reject
    const e = new Error(msg);
    e.status = status;
    e.data = data;
    e.raw = err;
    return Promise.reject(e);
  }
);

/* ======================
 *  Auth APIs
 * ====================== */

// 회원가입
export const signupApi = async (payload) => {
  // payload: { name, department, student_no, phone, password, email, account_bank, account_num ... }
  const res = await api.post("/auth/register", payload);
  return res.data;
};

// 로그인
// - (student_no, password) 또는 ({ student_no, password }) 둘 다 지원
// - Login.jsx에서 const { token, user } = await loginApi(username, password) 가능
export const loginApi = async (studentNoOrPayload, passwordOpt) => {
  const payload =
    typeof studentNoOrPayload === "string"
      ? { student_no: studentNoOrPayload, password: passwordOpt }
      : studentNoOrPayload;

  const res = await api.post("/auth/login", payload);

  const data = res?.data?.data || {};
  const token = data?.token;

  // 서버가 주는 사용자 정보(명세에 따라 data에 member_id 등 들어있음)
  const user = {
    member_id: data.member_id,
    student_no: data.student_no,
    username: data.student_no, // 프론트에서 username 쓰면 대응
    name: data.name,
    dept: data.department, // 프론트에서 dept 쓰면 대응
    department: data.department,
    email: data.email,
    is_admin: data.is_admin,
  };

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return { token, user, raw: res.data };
};

// 로그아웃
// (명세상 JWT는 서버 저장 X → 프론트에서 토큰 삭제가 핵심)
// 서버에 /auth/logout이 있으면 호출, 없어도 토큰 삭제는 수행
export const logoutApi = async () => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (e) {
    // /auth/logout이 없어서 404여도 프론트 로그아웃은 진행
    return { success: true, message: "logout (client only)" };
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// 회원탈퇴
// swagger: DELETE /auth/withdraw, body: { current_password: "..." } + Authorization 필요
export const withdrawApi = async ({ current_password }) => {
  const res = await api.delete("/auth/withdraw", {
    data: { current_password },
  });

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  return res.data;
};

/* ======================
 *  비밀번호 찾기
 * ====================== */

// 인증 코드 요청
export const findPwRequestApi = async (payload) => {
  // POST /auth/find-pw/request
  // payload 예: { student_no, email } (명세대로)
  const res = await api.post("/auth/find-pw/request", payload);
  return res.data;
};

// 인증 코드 검증
export const findPwVerifyApi = async (payload) => {
  // POST /auth/find-pw/verify
  // payload 예: { student_no, code }
  const res = await api.post("/auth/find-pw/verify", payload);
  return res.data;
};

// 비밀번호 변경
export const changePasswordApi = async (payload) => {
  // PATCH /auth/password
  // payload 예: { current_password, new_password } (명세대로)
  const res = await api.patch("/auth/password", payload);
  return res.data;
};

export default api;