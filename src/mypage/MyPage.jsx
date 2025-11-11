// src/mypage/MyPage.jsx
import './mypage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import BottomTab from '../components/BottomTab';
import { Link } from 'react-router-dom';


export default function MyPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // { name, username, email, dept, ... } 형태라고 가정

  // 표시용 안전한 값
  const v = (x) => (x ? x : '');

  return (
    <main className="MyPageWrap">
      {/* 헤더 */}
      <header className="MPHeader">
        <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
        <Link to="/" className="MPTitle MPBrandLink">SoomBrella</Link>
        <div style={{ width: 24 }} /> {/* 우측 공간 맞춤 */}
      </header>

      {/* 프로필 요약 */}
      <section className="ProfileCard">
        <div className="Avatar" aria-hidden>👤</div>
        <div className="Who">
          <div className="Nick">
            {user?.name || '사용자'} {user?.username ? `(${user.username})` : ''}
          </div>
          <div className="Meta">
            {user?.dept || '전공 미입력'}
          </div>
        </div>
      </section>

      {/* 탭 버튼 */}
      <nav className="Tabs">
        <button className="Tab active" type="button">계정 정보</button>
        <button className="Tab" type="button" onClick={() => navigate('/mypage/rents')}>대여 목록</button>
        <button className="Tab" type="button" onClick={() => navigate('/mypage/guide')}>이용 안내</button>
      </nav>

      {/* 계정 정보 폼(읽기 전용) */}
      <section className="Card">
        <label className="Label">아이디</label>
        <input className="Input" value={v(user?.username)} readOnly placeholder="-" />

        <label className="Label">이름</label>
        <input className="Input" value={v(user?.name)} readOnly placeholder="-" />

        <label className="Label">이메일</label>
        <input className="Input" value={v(user?.email)} readOnly placeholder="-" />

        <label className="Label">전공</label>
        <div className="SelectWrap">
          <select className="Select" value={v(user?.dept)} disabled>
            {/* disabled 셀렉트: 값만 보여주기 */}
            <option value={v(user?.dept)}>{v(user?.dept) || '-'}</option>
          </select>
          <span className="Chevron">▾</span>
        </div>
      </section>

      {/* 액션 버튼 */}
      <div className="Actions">
        <button className="Btn ghost" type="button" onClick={() => navigate('/mypage/profile-edit')}>프로필 수정</button>
        <button className="Btn primary" type="button" onClick={() => navigate('/mypage/password')}>비밀번호 변경</button>
      </div>

      <BottomTab />
    </main>
  );
}
