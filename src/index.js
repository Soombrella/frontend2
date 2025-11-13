import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
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
import MyPageGuide from './mypage/MyPageGuide.jsx';
import MyPageRents from './mypage/MyPageRents.jsx';
import MyPageRentDetail from './mypage/MyPageRentDetail.jsx';

import AdminHome from './admin/Home.jsx';
import AdminStock from './admin/Stock.jsx';
import AdminProfile from './admin/Profile.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
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
          <Route
            path="/mypage/rents/:id"
            element={
              <ProtectedRoute>
                <MyPageRentDetail />
              </ProtectedRoute>
            }
          />

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
