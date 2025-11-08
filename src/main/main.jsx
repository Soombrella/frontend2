import { Link } from 'react-router-dom';
import './main.css';     // 메인 전용 스타일
import { useState } from 'react';
import NoticeModal from '../components/NoticeModal';
import PriceTable from './PriceTable';  // ← 새로 만든 표 컴포넌트
import BottomTab from '../components/BottomTab';
import TermsModal from "../legal/TermsModal";
import PrivacyModal from "../legal/PrivacyModal";
import '../components/BottomTab.css';
import umbrellaImg from '../assets/umbrella.jpg';
import batteryImg from '../assets/powerbank.jpg';


export default function Main() {
  const [openNotice, setOpenNotice] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  return (
    <main className="Main">
      <header className="Nav">
        <Link to="/" className="BrandLink">SoomBrella</Link>
        <a className="LoginBtn" href="/login">로그인</a>
      </header>


      <section className="Notice">
        <p>
          대여 장소 | 학생회관 408호 총학생회실<br/>
          운영 기간 | 9월 ~ 별도 공지 시까지<br/>
          운영 시간 | 매주 월–금 / 10:20–16:30<br/>
          보증금 | 우산 6,000원, 보조배터리 8,000원<br/>
          *케이블 2,000원 추가 / 계좌이체만 가능*<br/>
          반납 기한 | 대여일 포함 3일 이내
        </p>

        {/* 요금표 이미지 자리 → 실제 표로 교체 */}
        <PriceTable />
      </section>

      <section className="PickGrid">
        <div className="PickCard">
          <img src={umbrellaImg} alt="우산" className="PhotoImg" />
          <Link to="/rent" className="PickBtn">우산</Link>
        </div>
        <div className="PickCard">
          <img src={batteryImg} alt="보조배터리" className="PhotoImg" />
          <Link to="/battery" className="PickBtn dark">보조배터리</Link>
        </div>
      </section>

      <button
       type="button"
       className="CTA"
       onClick={() => setOpenNotice(true)} >대여 전 꼭 확인해주세요</button>

      <footer className="Footer">
        <div className="LegalLinks">
          <button type="button" className="linklike" onClick={() => setTermsOpen(true)}>서비스 이용 약관</button>
          <span className="sep">|</span>
          <button type="button" className="linklike" onClick={() => setPrivacyOpen(true)}>개인정보 처리방침</button>
        </div>
      </footer>
      <BottomTab />
      <NoticeModal open={openNotice} onClose={() => setOpenNotice(false)} />
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </main>
  );
}
