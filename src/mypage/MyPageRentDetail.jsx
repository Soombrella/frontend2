// src/mypage/MyPageRentDetail.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./mypage.css";

function getById(id){
  const list = JSON.parse(localStorage.getItem("sb_rents") || "[]");
  return list.find(x => x.id === id);
}

// 남은 일수(오늘=0, 내일=1) / 지났으면 음수
function daysTo(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.floor((d - today) / (1000 * 60 * 60 * 24));
}
// 연체 일수(지난 날만 양수)
function overdueDays(dueDate) {
  const d = new Date(dueDate + "T00:00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.floor((today - d) / (1000*60*60*24));
  return diff > 0 ? diff : 0;
}
const statusLabel = (s) =>
  s === "renting" ? "대여중" :
  s === "overdue" ? "연체중" :
  s === "returned" ? "반납완료" : "예약중";

export default function MyPageRentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = useMemo(() => getById(id), [id]);

  if (!item) {
    return (
      <main className="MyPageWrap">
        <header className="MPHeader">
          <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
          <h1 className="MPTitle">상세</h1>
          <div style={{ width:24 }} />
        </header>
        <div style={{padding:16}}>내역을 찾을 수 없습니다.</div>
      </main>
    );
  }

  // 배지 텍스트/색상
  let badgeText = statusLabel(item.status);
  let badgeClass = "badge-blue";
  if (item.status === "returned") badgeClass = "badge-gray";
  if (item.status === "overdue")  badgeClass = "badge-red";
  if (item.status === "reserved") badgeClass = "badge-green";

  // D-Day 문자열
  const dueBadge =
    item.status === "overdue"
      ? `D+${overdueDays(item.dueDate)}`
      : (() => {
          const left = daysTo(item.dueDate);
          return left >= 0 ? `D-${left}` : `D+${Math.abs(left)}`;
        })();

  const rows = [
    ["품목", item.title],
    ["대여 상태", statusLabel(item.status)],
    ["대여일", item.rentDate || "-"],
    ["반납일", item.dueDate || "-"],
    ...(item.status === "renting" || item.status === "overdue"
      ? [["남은/경과", dueBadge]]
      : []),
    ["보증금 입금 여부", item.depositPaid ? "예" : "아니오"],
    ["보증금 환급 여부", item.depositRefunded ? "예" : "아니오"],
  ];

  return (
    <main className="MyPageWrap">
      <header className="MPHeader">
        <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
        <h1 className="MPTitle">대여 상세</h1>
        <div style={{ width:24 }} />
      </header>

      <section className="Card detail">
        {/* 썸네일 + 상태/디데이 배지 */}
        <div className="DetailThumb">
          <div className={`StateBadge ${badgeClass}`}>{badgeText}</div>
          {(item.status === "renting" || item.status === "overdue") && (
            <div className="DueBadge">{dueBadge}</div>
          )}
        </div>

        {/* 상세 정보 리스트 */}
        <div className="DetailList">
          {rows.map(([k,v]) => (
            <div className="DetailRow" key={k}>
              <div className="Key">{k}</div>
              <div className="Val">{v}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
