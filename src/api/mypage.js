// src/api/mypage.js
import api from "./auth";

/* =========================
   내 정보 조회 (GET /mypage/info)
========================= */
export const getMyInfoApi = async () => {
  const res = await api.get("/mypage/info");

  const data = res?.data?.data;

  return {
    member_id: data?.member_id,
    username: data?.student_no,
    name: data?.name,
    dept: data?.department,
    email: data?.email,
    phone: data?.phone,
    refund_account: data?.refund_account,
  };
};

/* =========================
   내 정보 수정 (PATCH /mypage/info)
   ⚠️ Swagger에서 PUT이면 patch → put
========================= */
export const updateMyInfoApi = async (payload) => {
  const res = await api.patch("/mypage/info", payload);
  return res.data; // { success, message, data }
};

/* =========================
   대여 이력 조회 (GET /mypage/rentals)
========================= */
export const getMyRentalsApi = async () => {
  const res = await api.get("/mypage/rentals");

  // 팀에서 { success, message, data } 형태로 주는 경우 대응
  return res.data;
};

/* =========================
   세부 예약 이력 조회
   (GET /mypage/reservations/{reservation_id})
========================= */
export const getRentalDetailApi = async (reservationId) => {
  const res = await api.get(`/mypage/reservations/${reservationId}`);
  return res.data?.data;
};

/* =========================
   세부 대여 이력 조회
   (GET /mypage/rentals/{rental_id})
========================= */
export const getRentalHistoryDetailApi = async (rentalId) => {
  const res = await api.get(`/mypage/rentals/${rentalId}`);
  return res.data?.data;
};