// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 메인/일반 페이지
import Main from './main/main.jsx';
import Login from './login/login.jsx';
import Signup from './signup/Signup.jsx';
import UmbrellaRent from './urent/UmbrellaRent.jsx';
import PowerBankRent from './prent/PowerBankRent.jsx';

// 인증/보호
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// 마이페이지
import MyPage from './mypage/MyPage.jsx';
import MyPageGuide from './mypage/MyPageGuide.jsx';
import MyPageRents from './mypage/MyPageRents.jsx';
import MyPageRentDetail from './mypage/MyPageRentDetail.jsx';

// (선택) 관리자 페이지들 – 필요하면 ProtectedRoute로 감싸거나 별도 가드 추가
//import Home from './admin/Home.jsx';
//import Stock from './admin/Stock.jsx';
//import Profile from './admin/Profile.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 공개 경로 */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rent" element={<UmbrellaRent />} />
          <Route path="/battery" element={<PowerBankRent />} />

          {/* 마이페이지 (로그인 필요) */}
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
          <Route
            path="/mypage/rents/:id"
            element={
              <ProtectedRoute>
                <MyPageRentDetail />
              </ProtectedRoute>
            }
          />

          {/* 404 (항상 마지막) */}
          <Route path="*" element={<h1 style={{textAlign:'center'}}>404</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
