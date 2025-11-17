// src/mypage/MyPageRents.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import SimpleModal from "../components/SimpleModal";
import "./mypage.css";
import BottomTab from "../components/BottomTab";
import "../components/BottomTab.css";
import umbrellaImg from "../assets/umbrella.jpg";
import powerbankImg from "../assets/powerbank.jpg";

/* ============== 로컬 목데이터 ============== */
function loadRents() {
  const raw = localStorage.getItem("sb_rents");
  if (raw) return JSON.parse(raw);

  const seed = [
    // 우산
    {
      id: "u-1001",
      type: "umbrella",
      title: "우산",
      status: "renting",
      rentDate: "2025-11-09",
      dueDate: "2025-11-11",
      returnDate: null,
      depositPaid: true,
      depositRefunded: false,
      thumb: null,
    },
    {
      id: "u-1002",
      type: "umbrella",
      title: "우산",
      status: "overdue",
      rentDate: "2025-11-10",
      dueDate: "2025-11-12",
      returnDate: null,
      depositPaid: true,
      depositRefunded: false,
      thumb: null,
    },
    {
      id: "u-1003",
      type: "umbrella",
      title: "우산",
      status: "returned",
      rentDate: "2025-10-20",
      dueDate: "2025-10-22",
      returnDate: "2025-10-21",
      depositPaid: true,
      depositRefunded: true,
      thumb: null,
    },

    // 보조배터리
    {
      id: "b-2001",
      type: "battery",
      title: "보조배터리",
      status: "reserved",
      rentDate: "2025-11-12",
      dueDate: "2025-11-15",
      returnDate: null,
      depositPaid: true,
      depositRefunded: false,
      thumb: null,
    },
    {
      id: "b-2002",
      type: "battery",
      title: "보조배터리",
      status: "renting",
      rentDate: "2025-11-05",
      dueDate: "2025-11-08",
      returnDate: null,
      depositPaid: true,
      depositRefunded: false,
      thumb: null,
    },
    {
      id: "b-2003",
      type: "battery",
      title: "보조배터리",
      status: "overdue",
      rentDate: "2025-10-31",
      dueDate: "2025-11-02",
      returnDate: null,
      depositPaid: true,
      depositRefunded: false,
      thumb: null,
    },
    { id:"b-2001", type:"battery", title:"보조배터리", status:"reserved",
      rentDate:"2025-11-12", dueDate:"2025-11-15", returnDate:null,
      depositPaid:true, depositRefunded:false, thumb:null, cable:true },
  ];

  localStorage.setItem("sb_rents", JSON.stringify(seed));
  return seed;
}
function saveRents(list) {
  localStorage.setItem("sb_rents", JSON.stringify(list));
}

/* ============== 날짜 유틸 ============== */
function toDate(dateStr) {
  return new Date(dateStr + "T00:00:00");
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function fmtYYYYMMDD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

/** 규칙: "대여일 포함 3일 이내" → 마감일 = rentDate + 2일 */
function getDerivedDueStr(item) {
  if (!item?.rentDate) return item?.dueDate ?? null;
  const d = addDays(toDate(item.rentDate), 2);
  return fmtYYYYMMDD(d);
}

function daysTo(dateStr) {
  if (!dateStr) return 0;
  const today = startOfToday();
  const d = toDate(dateStr);
  return Math.floor((d - today) / (1000 * 60 * 60 * 24));
}
function overdueDays(dateStr) {
  if (!dateStr) return 0;
  const today = startOfToday();
  const d = toDate(dateStr);
  const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function statusLabel(s) {
  return s === "renting"
    ? "대여중"
    : s === "overdue"
    ? "연체중"
    : s === "returned"
    ? "반납완료"
    : s === "reserved"
    ? "예약중"
    : s;
}

/** 화면 표시/정렬용 상태 계산 */
function computeView(item) {
  const baseStatus = item.status || "renting";
  const returned = baseStatus === "returned";
  const derivedDueStr = getDerivedDueStr(item);

  let currentStatus = baseStatus;
  if (!returned && derivedDueStr) {
    const isOverdue = startOfToday() > toDate(derivedDueStr);
    if (isOverdue) currentStatus = "overdue";
  }

  // 배지/색상
  let badgeText = statusLabel(currentStatus);
  let badgeClass = "badge-blue";
  if (currentStatus === "returned") badgeClass = "badge-gray";
  if (currentStatus === "overdue") badgeClass = "badge-red";
  if (currentStatus === "reserved") badgeClass = "badge-green";

  // D-day
  let dday = "-";
  if (currentStatus === "overdue") {
    dday = `D+${overdueDays(derivedDueStr)}`;
  } else if (currentStatus === "renting") {
    const left = daysTo(derivedDueStr);
    dday = left >= 0 ? `D-${left}` : `D+${Math.abs(left)}`;
  }

  return { currentStatus, derivedDueStr, badgeText, badgeClass, dday };
}

/** 정렬: overdue(오래된 순) → reserved → renting(임박 순) → returned(맨 아래) */
const byStatus = (a, b) => {
  const A = computeView(a);
  const B = computeView(b);

  const rank = (s) =>
    s === "overdue" ? 0 : s === "reserved" ? 1 : s === "renting" ? 2 : s === "returned" ? 3 : 9;

  const ra = rank(A.currentStatus);
  const rb = rank(B.currentStatus);
  if (ra !== rb) return ra - rb;

  if (A.currentStatus === "overdue") {
    // 오래된 순: D+ 큰 값 먼저
    return overdueDays(B.derivedDueStr) - overdueDays(A.derivedDueStr);
  }
  if (A.currentStatus === "renting") {
    // 임박 순: D- 작은 값 먼저
    return daysTo(A.derivedDueStr) - daysTo(B.derivedDueStr);
  }
  if (A.currentStatus === "reserved") {
    // 예약일 빠른 순 (없으면 뒤로)
    const ar = a.rentDate ? toDate(a.rentDate) : new Date(8640000000000000);
    const br = b.rentDate ? toDate(b.rentDate) : new Date(8640000000000000);
    return ar - br;
  }
  return 0;
};

export default function MyPageRents() {
  const { user } = useAuth() ?? {};
  const navigate = useNavigate();

  const [rents, setRents] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, id: null, title: "" });
  const [info, setInfo] = useState({ open: false, title: "알림", text: "" });

  useEffect(() => {
    setRents(loadRents());
  }, []);

  const openCancel = (item) =>
    setConfirm({
      open: true,
      id: item.id,
      title: `${item.title} 대여 신청을 취소하시겠습니까?`,
    });
  const closeCancel = () => setConfirm({ open: false, id: null, title: "" });

  const doCancel = () => {
    const id = confirm.id;
    const next = rents
      .map((r) => (r.id === id ? { ...r, status: "canceled" } : r))
      .filter((r) => r.status !== "canceled");
    setRents(next);
    saveRents(next);
    closeCancel();
    setInfo({ open: true, title: "알림", text: "취소되었습니다." });
  };

  const goDetailIfNeeded = (item) => {
    const { currentStatus } = computeView(item);
    if (currentStatus === "renting" || currentStatus === "overdue") {
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

    const { currentStatus, badgeText, badgeClass, dday } = computeView(item);

    const typeLabel = item.type === "umbrella" ? "우산" : "보조배터리";
    const title =
      item.title === typeLabel ? item.title : `${typeLabel} · ${item.title}`;

    return (
      <div
        className="RentCard"
        onClick={() => goDetailIfNeeded(item)}
        role="button"
      >
        <div className="RentThumb">
          <img
            className="RentImg"
            src={item.thumb || (item.type === "umbrella" ? umbrellaImg : powerbankImg)}
            alt={typeLabel}
            loading="lazy"
          />
          <div className={`StateBadge ${badgeClass}`}>{badgeText}</div>
          {(currentStatus === "renting" || currentStatus === "overdue") && (
            <div className={`DueBadge ${badgeClass}`}>{dday}</div>
          )}
        </div>

        <div className="TitleRow">
          <div className="RentTitle">{title}</div>
          {currentStatus === "reserved" && (
            <button
              className="CancelBtn"
              onClick={(e) => {
                e.stopPropagation();
                openCancel(item);
              }}
            >
              신청 취소
            </button>
          )}
        </div>

        <div className="RentHint">
          {currentStatus === "reserved" && "보증금 입금 완료 · 픽업 전"}
          {currentStatus === "renting" && "보증금 입금 완료 · 픽업 완료"}
          {currentStatus === "returned" && "기한 내 반납 완료"}
          {currentStatus === "overdue" && "반납 기한 경과"}
        </div>
      </div>
    );
  };

  // 전체 단일 정렬
  const sortedAll = useMemo(() => {
    return [...rents].sort(byStatus);
  }, [rents]);

  return (
    <main className="MyPageWrap">
      <header className="MPHeader">
        <button
          className="BackBtn"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          ←
        </button>
        <Link to="/" className="MPTitle MPBrandLink">
          SoomBrella
        </Link>
        <div style={{ width: 24 }} />
      </header>

      <section className="ProfileCard">
        <div className="Avatar" aria-hidden>
          👤
        </div>
        <div className="Who">
          <div className="Nick">
            {[user?.name, user?.username && `(${user.username})`]
              .filter(Boolean)
              .join(" ")}
          </div>
          <div className="Meta">{user?.dept || ""}</div>
        </div>
      </section>

      <nav className="Tabs">
        <button className="Tab" onClick={() => navigate("/mypage")}>
          계정 정보
        </button>
        <button className="Tab active">대여 목록</button>
        <button className="Tab" onClick={() => navigate("/mypage/guide")}>
          이용 안내
        </button>
      </nav>

      <section className="Card grid-12">
        {sortedAll.length === 0
          ? renderCard(null, "내역")
          : sortedAll.map((item) => (
              <div key={item.id}>
                {renderCard(
                  item,
                  item.type === "umbrella" ? "우산" : "보조배터리"
                )}
              </div>
            ))}
      </section>

      {/* 예약 취소 확인 모달 */}
      <SimpleModal
        open={confirm.open}
        title="신청 취소"
        onClose={() => setConfirm({ open: false, id: null, title: "" })}
        onConfirm={doCancel}
        confirmText="신청 취소"
      >
        <p style={{ lineHeight: 1.6 }}>{confirm.title}</p>
      </SimpleModal>

      {/* 완료 알림 모달 */}
      <SimpleModal
        open={info.open}
        title="알림"
        onClose={() => setInfo({ open: false, title: "", text: "" })}
      >
        <p style={{ lineHeight: 1.6 }}>{info.text}</p>
      </SimpleModal>

      <BottomTab />
    </main>
  );
}
