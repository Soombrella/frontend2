// src/mypage/MyPageRentDetail.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./mypage.css";
import BottomTab from "../components/BottomTab";
import "../components/BottomTab.css";
import umbrellaImg from "../img/umbrella.jpg";
import powerbankImg from "../img/powerbank.jpg"

/* ---------- 로컬 저장소에서 항목 조회 ---------- */
function getById(id) {
  const list = JSON.parse(localStorage.getItem("sb_rents") || "[]");
  return list.find((x) => x.id === id);
}

/* ---------- 날짜 유틸 ---------- */
function toDate(dateStr) { return new Date(dateStr + "T00:00:00"); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmtYYYYMMDD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function startOfToday() { const t = new Date(); t.setHours(0,0,0,0); return t; }

/** 규칙: "대여일 포함 3일 이내" → 마감일 = rentDate + 2일 */
function getDerivedDueStr(item) {
  if (!item?.rentDate) return item?.dueDate ?? null;
  const d = addDays(toDate(item.rentDate), 2);
  return fmtYYYYMMDD(d);
}

function daysTo(dateStr){
  if (!dateStr) return 0;
  const today = startOfToday();
  const d = toDate(dateStr);
  return Math.floor((d - today) / (1000*60*60*24));
}
function overdueDays(dateStr){
  if (!dateStr) return 0;
  const today = startOfToday();
  const d = toDate(dateStr);
  const diff = Math.floor((today - d) / (1000*60*60*24));
  return Math.max(0, diff);
}

const statusLabel = (s) =>
  s === "renting"  ? "대여중"   :
  s === "overdue"  ? "연체중"   :
  s === "returned" ? "반납완료" :
  s === "reserved" ? "예약중"   : s;

/** 화면 표시용 상태/배지 계산 */
function computeView(item){
  const baseStatus    = item.status || "renting";
  const returned      = baseStatus === "returned";
  const derivedDueStr = getDerivedDueStr(item);

  let currentStatus = baseStatus;
  if (!returned && derivedDueStr){
    const isOverdue = startOfToday() > toDate(derivedDueStr);
    if (isOverdue) currentStatus = "overdue";
  }

  // 배지 색상 클래스 & 텍스트
  let badgeClass = "badge-blue";
  if (currentStatus === "returned") badgeClass = "badge-gray";
  if (currentStatus === "overdue")  badgeClass = "badge-red";
  if (currentStatus === "reserved") badgeClass = "badge-green";
  const badgeText = statusLabel(currentStatus);

  // D-day
  let dday = "-";
  if (currentStatus === "overdue"){
    dday = `D+${overdueDays(derivedDueStr)}`;
  } else if (currentStatus === "renting"){
    const left = daysTo(derivedDueStr);
    dday = left >= 0 ? `D-${left}` : `D+${Math.abs(left)}`;
  }

  return { currentStatus, derivedDueStr, badgeText, badgeClass, dday };
}

export default function MyPageRentDetail(){
  const { id } = useParams();
  const navigate = useNavigate();
  const item = useMemo(() => getById(id), [id]);

  if (!item){
    return (
      <main className="MyPageWrap">
        <header className="MPHeader">
          <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
          <h1 className="MPTitle">대여 상세</h1>
          <div style={{ width:24 }} />
        </header>
        <div style={{ padding:16 }}>내역을 찾을 수 없습니다.</div>
        <BottomTab />
      </main>
    );
  }

  const { currentStatus, derivedDueStr, badgeText, badgeClass, dday } = computeView(item);

  // 상세 정보 행
  const rows = [
    ["품목", item.title],
    ["대여 상태", statusLabel(currentStatus)],
    ["대여일", item.rentDate || "-"],
    ["반납일", derivedDueStr || "-"], // 대여일 + 2일
    ...(currentStatus === "renting" || currentStatus === "overdue" ? [["남은/경과", dday]] : []),
    ["보증금 입금 여부", item.depositPaid ? "예" : "아니오"],
    ["보증금 환급 여부", item.depositRefunded ? "예" : "아니오"],
  ];

  const typeLabel = item.type === "umbrella" ? "우산" : "보조배터리";
  const heroImg   = item.thumb || (item.type === "umbrella" ? umbrellaImg : powerbankImg);

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
          <img className="DetailImg" src={heroImg} alt={typeLabel} loading="lazy" />
          <div className={`StateBadge ${badgeClass}`}>{badgeText}</div>
          {(currentStatus === "renting" || currentStatus === "overdue") && (
            <div className={`DueBadge ${badgeClass}`}>{dday}</div>
          )}
        </div>

        {/* 상세 정보 리스트 */}
        <div className="DetailList">
          {rows.map(([k, v]) => (
            <div className="DetailRow" key={k}>
              <div className="Key">{k}</div>
              <div className="Val">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <BottomTab />
    </main>
  );
}
