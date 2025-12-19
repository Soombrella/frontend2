// src/api/mypage.js
const BASE = process.env.REACT_APP_API_BASE_URL;

function getToken() {
  return localStorage.getItem("sb_token");
}

async function safeJson(res) {
  return await res.json().catch(() => null);
}

/* =========================
   내 정보 조회 (GET /mypage/info)
========================= */
export async function getMyInfoApi() {
  const token = getToken();
  if (!token) {
    const err = new Error("NO_TOKEN");
    err.status = 401;
    throw err;
  }

  const res = await fetch(`${BASE}/mypage/info`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const json = await safeJson(res);

  if (!res.ok) {
    const msg = json?.message || "내 정보 조회에 실패했습니다.";
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  const data = json?.data;

  return {
    member_id: data?.member_id,
    username: data?.student_no,
    name: data?.name,
    dept: data?.department,
    email: data?.email,
    phone: data?.phone,
    refund_account: data?.refund_account,
  };
}

/* =========================
   내 정보 수정 (PATCH /mypage/info)
   ⚠️ 405 뜨면 method를 PUT으로 바꿔.
========================= */
export async function updateMyInfoApi(payload) {
  const token = getToken();
  if (!token) {
    const err = new Error("NO_TOKEN");
    err.status = 401;
    throw err;
  }

  const res = await fetch(`${BASE}/mypage/info`, {
    method: "PATCH", // ✅ 405면 "PUT"으로 변경
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    const msg = json?.message || "내 정보 수정에 실패했습니다.";
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  // 보통 { success, message, data } 형태
  return json;
}
/* =========================
   대여 이력 조회 (GET /mypage/rentals)
========================= */
export async function getMyRentalsApi() {
  const token = getToken();
  if (!token) {
    const err = new Error("NO_TOKEN");
    err.status = 401;
    throw err;
  }

  const res = await fetch(`${BASE}/mypage/rentals`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const json = await safeJson(res);

  if (!res.ok) {
    const msg = json?.message || "대여 이력 조회에 실패했습니다.";
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json?.data ?? []; // 명세: { success, message, data: [...] }
}
// =========================
// 세부 예약 이력 조회 (GET /mypage/rentals/{reservation_id})
// =========================
export async function getRentalDetailApi(reservationId) {
  const token = getToken();
  if (!token) {
    const err = new Error("NO_TOKEN");
    err.status = 401;
    throw err;
  }

  const res = await fetch(`${BASE}/mypage/rentals/${reservationId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const json = await safeJson(res);

  if (!res.ok) {
    const err = new Error(json?.message || "세부 예약 이력 조회에 실패했습니다.");
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json?.data; // { success, message, data: {...} }
}