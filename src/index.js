import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./main/main.jsx";
import Login from "./login/login.jsx";
import UmbrellaRent from "./urent/UmbrellaRent.jsx";
import Signup from "./signup/Signup.jsx";
import PowerBankRent from "./prent/PowerBankRent.jsx";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import MyPage from "./mypage/MyPage.jsx";
import MyPageGuide from "./mypage/MyPageGuide.jsx";
import MyPageRents from "./mypage/MyPageRents.jsx";

// ✅ 예약 상세(세부 예약 이력 조회)
import MyPageRentDetail from "./mypage/MyPageRentDetail.jsx";

// ✅ 대여 상세(세부 대여 이력 조회)
import MyPageRentalHistoryDetail from "./mypage/MyPageRentalHistoryDetail.jsx";

// ✅ 마이페이지 비밀번호 변경 페이지 (신규)
import MyPagePassword from "./mypage/MyPagePassword.jsx";

// ✅ 관리자
import AdminHome from "./admin/Home.jsx";
import AdminStock from "./admin/Stock.jsx";
import AdminProfile from "./admin/Profile.jsx";

// ✅ 비밀번호 찾기
import FindPwRequest from "./findpw/FindPwRequest.jsx";
import FindPwVerify from "./findpw/FindPwVerify.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rent" element={<UmbrellaRent />} />
          <Route path="/battery" element={<PowerBankRent />} />
          <Route path="/signup" element={<Signup />} />

          {/* Find Password (public) */}
          <Route path="/findpw" element={<FindPwRequest />} />
          <Route path="/findpw/verify" element={<FindPwVerify />} />

          {/* My Page (protected) */}
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage/guide"
            element={
              <ProtectedRoute>
                <MyPageGuide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage/rents"
            element={
              <ProtectedRoute>
                <MyPageRents />
              </ProtectedRoute>
            }
          />

          {/* ✅ 비밀번호 변경 */}
          <Route
            path="/mypage/password"
            element={
              <ProtectedRoute>
                <MyPagePassword />
              </ProtectedRoute>
            }
          />

          {/* ✅ 예약 상세: GET /mypage/reservations/{reservation_id} */}
          <Route
            path="/mypage/rents/reservations/:reservationId"
            element={
              <ProtectedRoute>
                <MyPageRentDetail />
              </ProtectedRoute>
            }
          />

          {/* ✅ 대여 상세: GET /mypage/rentals/{rental_id} */}
          <Route
            path="/mypage/rents/rentals/:rentalId"
            element={
              <ProtectedRoute>
                <MyPageRentalHistoryDetail />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/stock" element={<AdminStock />} />
          <Route path="/admin/profile" element={<AdminProfile />} />

          {/* Fallback */}
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();