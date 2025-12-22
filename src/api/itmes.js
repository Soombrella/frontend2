// src/api/items.js
import api from "./auth";

/* =========================
   물품 대여 예약
   POST /items/rent
========================= */
export const rentItemApi = async (payload) => {
  // payload: RentRequest
  const res = await api.post("/items/rent", payload);
  return res.data; // RentResponse
};

/* =========================
   물품 재고 수 조회
   GET /items/available/count
========================= */
export const getAvailableCountApi = async () => {
  const res = await api.get("/items/available/count");
  return res.data; // AvailableCountResponse
};