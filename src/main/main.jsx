import './main.css';

export default function Main() {
  return (
    <main className="Main">
      <header className="Nav">
        <button className="BackBtn" aria-label="뒤로가기">←</button>
        <h1 className="Brand">SoomBrella</h1>
        <button className="LoginBtn">로그인</button>
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
        <div className="PriceCard">
          <div className="Chip yellow">우산</div>
          <div className="ImgStub">요금표 이미지</div>
        </div>
        <div className="PriceCard">
          <div className="Chip blue">보조배터리</div>
          <div className="ImgStub">요금표 이미지</div>
        </div>
      </section>

      <section className="PickGrid">
        <div className="PickCard">
          <div className="Photo">이미지</div>
          <button className="PickBtn">우산</button>
        </div>
        <div className="PickCard">
          <div className="Photo">이미지</div>
          <button className="PickBtn dark">보조배터리</button>
        </div>
      </section>

      <a className="CTA" href="#">대여 전 꼭 확인해주세요</a>

      <footer className="Footer">
        <a className="FlatBtn" href="#">약관</a>
        <a className="FlatBtn" href="#">개인정보 처리방침</a>
      </footer>
    </main>
  );
}
