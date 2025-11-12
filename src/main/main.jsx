// src/main/main.jsx
import { Link, useNavigate } from 'react-router-dom';
import './main.css';
import { useState } from 'react';
import NoticeModal from '../components/NoticeModal';
import PriceTable from './PriceTable';
import BottomTab from '../components/BottomTab';
import TermsModal from "../legal/TermsModal";
import PrivacyModal from "../legal/PrivacyModal";
import SimpleModal from "../components/SimpleModal";
import '../components/BottomTab.css';
import umbrellaImg from '../assets/umbrella.jpg';
import batteryImg from '../assets/powerbank.jpg';
import { useAuth } from '../auth/AuthContext';

export default function Main() {
  const navigate = useNavigate();
  const [openNotice, setOpenNotice] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [needLoginOpen, setNeedLoginOpen] = useState(false);

  const { user, logout } = useAuth() ?? {};

  const goRent = () => {
    if (user) navigate('/rent');
    else setNeedLoginOpen(true);
  };
  const goBattery = () => {
    if (user) navigate('/battery');
    else setNeedLoginOpen(true);
  };

  return (
    <main className="Main">
      {/* 헤더 */}
      <header className="Nav">
        <Link to="/" className="BrandLink">SoomBrella</Link>

        {user ? (
          <button className="LoginBtn" onClick={logout}>로그아웃</button>
        ) : (
          <Link className="LoginBtn" to="/login">로그인</Link>
        )}
      </header>

      {/* 안내/요금표 */}
      <section className="Notice">
        <p>
          대여 장소 | 학생회관 408호 총학생회실<br/>
          운영 기간 | 9월 ~ 별도 공지 시까지<br/>
          운영 시간 | 매주 월–금 / 10:20–16:30<br/>
          보증금 | 우산 6,000원, 보조배터리 8,000원<br/>
          *케이블 2,000원 추가 / 계좌이체만 가능*<br/>
          반납 기한 | 대여일 포함 3일 이내
        </p>

        <PriceTable />
      </section>

      {/* 선택 카드 */}
      <section className="PickGrid">
        <div className="PickCard">
          <img src={umbrellaImg} alt="우산" className="PhotoImg" />
          {user ? (
            <Link to="/rent" className="PickBtn">우산</Link>
          ) : (
            <button type="button" className="PickBtn" onClick={goRent}>우산</button>
          )}
        </div>

        <div className="PickCard">
          <img src={batteryImg} alt="보조배터리" className="PhotoImg" />
          {user ? (
            <Link to="/battery" className="PickBtn dark">보조배터리</Link>
          ) : (
            <button type="button" className="PickBtn dark" onClick={goBattery}>보조배터리</button>
          )}
        </div>
      </section>

      {/* CTA */}
      <button
        type="button"
        className="CTA"
        onClick={() => setOpenNotice(true)}
      >
        대여 전 꼭 확인해주세요
      </button>

      {/* 푸터 링크 */}
      <footer className="Footer">
        <div className="LegalLinks">
          <button type="button" className="linklike" onClick={() => setTermsOpen(true)}>
            서비스 이용 약관
          </button>
          <span className="sep">|</span>
          <button type="button" className="linklike" onClick={() => setPrivacyOpen(true)}>
            개인정보 처리방침
          </button>
        </div>
      </footer>

      <BottomTab />

      {/* 모달들 */}
      <NoticeModal open={openNotice} onClose={() => setOpenNotice(false)} />
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      {/* 로그인 필요 모달 */}
      <SimpleModal
        open={needLoginOpen}
        title="로그인이 필요합니다"
        onClose={() => setNeedLoginOpen(false)}
        onConfirm={() => {
          setNeedLoginOpen(false);
          navigate('/login');
        }}
        confirmText="로그인 하러가기"
      >
        <p style={{lineHeight:1.6}}>
          대여 서비스를 이용하려면 로그인해 주세요.
        </p>
      </SimpleModal>
    </main>
  );
}
