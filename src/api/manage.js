// src/api/manage.js
import api from "./auth";

/* =========================
   학생 대여 목록 조회
   GET /manage/users
========================= */
export const getUserRentalsApi = async () => {
  const res = await api.get("/manage/users");
  return res.data; // UserRentalListResponse
};

/* =========================
   학생 대여 상태 수정
   PATCH /manage/users/{user_id}
========================= */
export const updateUserRentalApi = async (userId, payload) => {
  // payload: UserRentalStatusUpdate
  const res = await api.patch(`/manage/users/${userId}`, payload);
  return res.data; // UserRentalUpdateResponse
};

/* =========================
   학생 대여 기록 삭제
   DELETE /manage/users/{user_id}
========================= */
export const deleteUserRentalApi = async (userId) => {
  const res = await api.delete(`/manage/users/${userId}`);
  return res.data; // BooleanResponse
};

/* =========================
   재고 목록 조회
   GET /manage/items
========================= */
export const getManageItemsApi = async () => {
  const res = await api.get("/manage/items");
  return res.data; // ItemListResponse 또는 manage 전용 response
};

/* =========================
   재고 수정
   PATCH /manage/items/{item_id}
========================= */
export const updateManageItemApi = async (itemId, payload) => {
  const res = await api.patch(`/manage/items/${itemId}`, payload);
  return res.data;
};

/* =========================
   재고 삭제
   DELETE /manage/items/{item_id}
========================= */
export const deleteManageItemApi = async (itemId) => {
  const res = await api.delete(`/manage/items/${itemId}`);
  return res.data; // BooleanResponse
};
