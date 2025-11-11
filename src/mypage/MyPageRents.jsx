import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import SimpleModal from "../components/SimpleModal";
import "./mypage.css";
import { Link } from 'react-router-dom';
import BottomTab from '../components/BottomTab';
import '../components/BottomTab.css';


// ✅ 임시 데이터 로딩 (나중에 API로 교체)
function loadRents() {
  const raw = localStorage.getItem("sb_rents");
  if (raw) return JSON.parse(raw);

  const seed = [
    // 우산
    { id:"u-1001", type:"umbrella", title:"우산", status:"renting",
      rentDate:"2025-11-07", dueDate:"2025-11-10", returnDate:null,
      depositPaid:true, depositRefunded:false, thumb:null },
    { id:"u-1002", type:"umbrella", title:"우산", status:"overdue",
      rentDate:"2025-10-30", dueDate:"2025-11-01", returnDate:null,
      depositPaid:true, depositRefunded:false, thumb:null },
    { id:"u-1003", type:"umbrella", title:"우산", status:"returned",
      rentDate:"2025-10-20", dueDate:"2025-10-22", returnDate:"2025-10-21",
      depositPaid:true, depositRefunded:true,  thumb:null },

    // 보조배터리
    { id:"b-2001", type:"battery", title:"보조배터리", status:"reserved",
      rentDate:"2025-11-12", dueDate:"2025-11-15", returnDate:null,
      depositPaid:true, depositRefunded:false, thumb:null },
    { id:"b-2002", type:"battery", title:"보조배터리", status:"renting",
      rentDate:"2025-11-05", dueDate:"2025-11-08", returnDate:null,
      depositPaid:true, depositRefunded:false, thumb:null },
    { id:"b-2003", type:"battery", title:"보조배터리", status:"overdue",
      rentDate:"2025-10-31", dueDate:"2025-11-02", returnDate:null,
      depositPaid:true, depositRefunded:false, thumb:null },
  ];

  localStorage.setItem("sb_rents", JSON.stringify(seed));
  return seed;
}

function saveRents(list){ localStorage.setItem("sb_rents", JSON.stringify(list)); }

// D+N 계산
function overdueDays(dueDate) {
  const d = new Date(dueDate + "T00:00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.floor((today - d) / (1000*60*60*24));
  return diff > 0 ? diff : 0;
}

// 남은 일수(오늘=0, 내일=1) / 지났으면 음수
function daysTo(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + 'T00:00:00');
  return Math.floor((d - today) / (1000 * 60 * 60 * 24));
}

export default function MyPageRents() {
  const { user } = useAuth() ?? {};
  const navigate = useNavigate();

  const [rents, setRents] = useState([]);
  const [confirm, setConfirm] = useState({ open:false, id:null, title:"" });
  const [info, setInfo] = useState({ open:false, title:"알림", text:"" });

  useEffect(() => { setRents(loadRents()); }, []);

  const umbrellas = useMemo(() => rents.filter(r => r.type === "umbrella"), [rents]);
  const batteries = useMemo(() => rents.filter(r => r.type === "battery"), [rents]);


  const openCancel = (item) => setConfirm({ open:true, id:item.id, title:`${item.title} 대여 신청을 취소하시겠습니까?` });
  const closeCancel = () => setConfirm({ open:false, id:null, title:"" });

  const doCancel = () => {
    const id = confirm.id;
    const next = rents.map(r => r.id === id ? { ...r, status:"canceled" } : r).filter(r => r.status !== "canceled");
    setRents(next); saveRents(next);
    closeCancel();
    setInfo({ open:true, title:"알림", text:"취소되었습니다." });
  };

  const goDetailIfNeeded = (item) => {
    if (item.status === "renting" || item.status === "overdue") {
      navigate(`/mypage/rents/${item.id}`);
    }
  };

  const renderCard = (item, fallbackTitle) => {
  if (!item) {
    return (
      <div className="RentCard empty">
        <div className="RentThumb" />
        <div className="RentTitle">{fallbackTitle}</div>
        <div className="RentEmptyMsg">현재 내역이 없어요</div>
      </div>
    );
  }

  // 상태 배지
  let badgeText = "대여중", badgeClass = "badge-blue";
  if (item.status === "returned") { badgeText = "반납완료"; badgeClass = "badge-gray"; }
  if (item.status === "overdue")  { badgeText = `연체중 · D+${overdueDays(item.dueDate)}`; badgeClass = "badge-red"; }
  if (item.status === "reserved") { badgeText = "예약중";  badgeClass = "badge-green"; }

  // D-day (대여중/연체중일 때만)
  const leftDays = (() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(item.dueDate + 'T00:00:00');
    return Math.floor((d - today) / (1000 * 60 * 60 * 24));
  })();
  const dday = item.status === 'overdue'
    ? `D+${overdueDays(item.dueDate)}`
    : (leftDays >= 0 ? `D-${leftDays}` : `D+${Math.abs(leftDays)}`);

  return (
    <div className="RentCard" onClick={() => goDetailIfNeeded(item)} role="button">
      <div className="RentThumb">
        <div className={`StateBadge ${badgeClass}`}>{badgeText}</div>
        {(item.status === 'renting' || item.status === 'overdue') && (
          <div className="DueBadge">{dday}</div>
        )}
      </div>

      {/* ⬇️ 제목과 취소 버튼을 같은 줄에 */}
      <div className="TitleRow">
        <div className="RentTitle">{item.title}</div>
        {item.status === "reserved" && (
          <button
            className="CancelBtn"
            onClick={(e) => { e.stopPropagation(); openCancel(item); }}
          >
            신청 취소
          </button>
        )}
      </div>

      <div className="RentHint">
        {item.status === "reserved" && "보증금 입금 완료 · 픽업 전"}
        {item.status === "renting"  && "보증금 입금 완료 · 픽업 완료"}
        {item.status === "returned" && "기한 내 반납 완료"}
        {item.status === "overdue"  && "반납 기한 경과"}
      </div>
    </div>
  );
};


  return (
    <main className="MyPageWrap">
      <header className="MPHeader">
        <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
        <Link to="/" className="MPTitle MPBrandLink">SoomBrella</Link>
        <div style={{ width: 24 }} />
      </header>

      <section className="ProfileCard">
        <div className="Avatar" aria-hidden>👤</div>
        <div className="Who">
          <div className="Nick">{[user?.name, user?.username && `(${user.username})`].filter(Boolean).join(" ")}</div>
          <div className="Meta">{user?.dept || ""}</div>
        </div>
      </section>

      <nav className="Tabs">
        <button className="Tab" onClick={() => navigate("/mypage")}>계정 정보</button>
        <button className="Tab active">대여 목록</button>
        <button className="Tab" onClick={() => navigate("/mypage/guide")}>이용 안내</button>
      </nav>

      <section className="Card grid-12">
        {umbrellas.length === 0
        ? renderCard(null, "우산")
        : umbrellas
        // 연체→대여중→예약중→반납완료 순으로 정렬(선택)
          .sort((a,b)=>{
            const order = { overdue:0, renting:1, reserved:2, returned:3 };
            return (order[a.status] ?? 9) - (order[b.status] ?? 9);
          })
          .map(item => <div key={item.id}>{renderCard(item, "우산")}</div>)
        }

        {batteries.length === 0
        ? renderCard(null, "보조배터리")
        : batteries
          .sort((a,b)=>{
            const order = { overdue:0, renting:1, reserved:2, returned:3 };
            return (order[a.status] ?? 9) - (order[b.status] ?? 9);
          })
          .map(item => <div key={item.id}>{renderCard(item, "보조배터리")}</div>)
        }
      </section>


      {/* 예약 취소 확인 모달 */}
      <SimpleModal
        open={confirm.open}
        title="신청 취소"
        onClose={() => setConfirm({ open:false, id:null, title:"" })}
        onConfirm={doCancel}
        confirmText="신청 취소"
      >
        <p style={{lineHeight:1.6}}>{confirm.title}</p>
      </SimpleModal>

      {/* 완료 알림 모달 */}
      <SimpleModal
        open={info.open}
        title="알림"
        onClose={() => setInfo({ open:false, title:"", text:"" })}
      >
        <p style={{lineHeight:1.6}}>{info.text}</p>
      </SimpleModal>
      <BottomTab />
    </main>
  );
}
