import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';   // 사용 안 함 → 제거해도 됨
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './main/main.jsx';
import Login from './login/login.jsx';
import UmbrellaRent from './urent/UmbrellaRent.jsx';
import Signup from './signup/Signup.jsx';
import PowerBankRent from './prent/PowerBankRent.jsx';
import AdminLayout from './admin/AdminLayout';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import MyPage from './mypage/MyPage.jsx'; // 마이페이지 컴포넌트
import MyPageGuide from './mypage/MyPageGuide.jsx';
import MyPageRents from './mypage/MyPageRents.jsx';
import MyPageRentDetail from './mypage/MyPageRentDetail.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rent" element={<UmbrellaRent />} />
        <Route path="/battery" element={<PowerBankRent />} />
        <Route path="/signup" element={<Signup />} />
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
          <Route path="/admin/*" element={<AdminLayout />}/> {/* 관리자 */}
          <Route path="*" element={<h1>404</h1>} />
          <Route
            path="/mypage/rents"
            element={<ProtectedRoute><MyPageRents /></ProtectedRoute>}
          />
          <Route
            path="/mypage/rents/:id"
            element={<ProtectedRoute><MyPageRentDetail /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();