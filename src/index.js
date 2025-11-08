import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';   // 사용 안 함 → 제거해도 됨
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './main/main.jsx';
import Login from './login/login.jsx';
import UmbrellaRent from './urent/UmbrellaRent.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Login />} />  {/* 임시 */}
        <Route path="/rent" element={<UmbrellaRent />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();