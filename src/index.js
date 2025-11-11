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
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import MyPage from './mypage/MyPage.jsx';
import Home from './admin/Home.jsx';
import Stock from './admin/Stock.jsx';
import Profile from './admin/Profile.jsx';

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
          <Route path="/admin" element={<Home />} />
          <Route path="/admin/stock" element={<Stock />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();