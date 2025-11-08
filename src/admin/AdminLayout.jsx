// 최소 골격만: 제목 설정 + 빈 화면
import React, { useEffect } from 'react';

export default function AdminLayout() {
  useEffect(() => {
    document.title = 'SoomBrella - Admin';
  }, []);

  return (
    <div style={{
      maxWidth: 980, margin: '0 auto', padding: '24px 16px',
      minHeight: '100vh', boxSizing: 'border-box'
    }}>
      <h1 style={{ fontSize: 24, margin: '6px 0 12px' }}>관리자 페이지</h1>
      <p style={{ color: '#6b7280' }}>준비중입니다.</p>
      {/* 필요 시 여기에 컴포넌트들을 점진적으로 추가하면 됩니다. */}
    </div>
  );
}
