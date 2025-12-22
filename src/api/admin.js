// src/api/admin.js
import api from "./auth";

/* =========================
   카테고리
========================= */

// 목록
export const getCategoriesApi = async () => {
  const res = await api.get("/admin/categories");
  return res.data; // CategoryListResponse
};

// 생성
export const createCategoryApi = async (payload) => {
  const res = await api.post("/admin/categories", payload);
  return res.data; // CategoryResponse
};

// 단일 조회
export const getCategoryApi = async (categoryId) => {
  const res = await api.get(`/admin/categories/${categoryId}`);
  return res.data; // CategoryDetailResponse
};

// 수정
export const updateCategoryApi = async (categoryId, payload) => {
  const res = await api.patch(`/admin/categories/${categoryId}`, payload);
  return res.data;
};

// 삭제
export const deleteCategoryApi = async (categoryId) => {
  const res = await api.delete(`/admin/categories/${categoryId}`);
  return res.data; // BooleanResponse
};

/* =========================
   물품
========================= */

// 목록
export const getAdminItemsApi = async () => {
  const res = await api.get("/admin/items");
  return res.data; // ItemListResponse
};

// 생성
export const createItemApi = async (payload) => {
  const res = await api.post("/admin/items", payload);
  return res.data; // ItemResponse
};

// 단일 조회
export const getAdminItemApi = async (itemId) => {
  const res = await api.get(`/admin/items/${itemId}`);
  return res.data; // ItemDetailResponse
};

// 수정
export const updateAdminItemApi = async (itemId, payload) => {
  const res = await api.patch(`/admin/items/${itemId}`, payload);
  return res.data; // ItemUpdateResponse
};

// 삭제
export const deleteAdminItemApi = async (itemId) => {
  const res = await api.delete(`/admin/items/${itemId}`);
  return res.data; // BooleanResponse
};