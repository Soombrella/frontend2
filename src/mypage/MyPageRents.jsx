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

import { getMyRentalsApi } from "../api/mypage";

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

  let badgeText = statusLabel(currentStatus);
  let badgeClass = "badge-blue";
  if (currentStatus === "returned") badgeClass = "badge-gray";
  if (currentStatus === "overdue") badgeClass = "badge-red";
  if (currentStatus === "reserved") badgeClass = "badge-green";

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
    s === "overdue"
      ? 0
      : s === "reserved"
      ? 1
      : s === "renting"
      ? 2
      : s === "returned"
      ? 3
      : 9;

  const ra = rank(A.currentStatus);
  const rb = rank(B.currentStatus);
  if (ra !== rb) return ra - rb;

  if (A.currentStatus === "overdue") {
    return overdueDays(B.derivedDueStr) - overdueDays(A.derivedDueStr);
  }
  if (A.currentStatus === "renting") {
    return daysTo(A.derivedDueStr) - daysTo(B.derivedDueStr);
  }
  if (A.currentStatus === "reserved") {
    const ar = a.rentDate ? toDate(a.rentDate) : new Date(8640000000000000);
    const br = b.rentDate ? toDate(b.rentDate) : new Date(8640000000000000);
    return ar - br;
  }
  return 0;
};

/* ============== 서버 → UI 매핑 유틸 ============== */
function normalizeCategory(raw) {
  const c = String(raw || "").trim().toLowerCase();
  // 백엔드가 umbrella / powerbank 라고 했으니 그걸 우선 처리
  if (c === "umbrella") return { type: "umbrella", label: "우산" };
  if (c === "powerbank") return { type: "battery", label: "보조배터리" };

  // 혹시 한글 등 섞이면 안전하게
  if (c.includes("우산")) return { type: "umbrella", label: "우산" };
  if (c.includes("배터리") || c.includes("보조"))
    return { type: "battery", label: "보조배터리" };

  return { type: "umbrella", label: raw || "우산" };
}

function mapApiStatusToUi(status) {
  if (!status) return "renting";
  const s = String(status).toLowerCase();

  if (s.includes("return") || s.includes("반납")) return "returned";
  if (s.includes("overdue") || s.includes("연체")) return "overdue";
  if (s.includes("reserve") || s.includes("예약")) return "reserved";
  if (s.includes("rent") || s.includes("대여")) return "renting";

  return "renting";
}

export default function MyPageRents() {
  const { user } = useAuth() ?? {};
  const navigate = useNavigate();

  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [confirm, setConfirm] = useState({ open: false, id: null, title: "" });
  const [info, setInfo] = useState({ open: false, title: "알림", text: "" });

  useEffect(() => {
    const fetchRents = async () => {
      setLoading(true);
      setErr("");

      try {
        // ✅ getMyRentalsApi()는 "배열"을 바로 리턴하도록 만들어둔 상태임
        const list = await getMyRentalsApi(); // => [...]
        const safeList = Array.isArray(list) ? list : [];

        const mapped = safeList.map((x) => {
          const { type, label } = normalizeCategory(x.category_name);

          return {
            // 목록/키
            id: String(x.reservation_id ?? x.rental_id ?? ""), // fallback 포함
            reservation_id: x.reservation_id ?? null,
            rental_id: x.rental_id ?? null, // ✅ 세부 대여 이력 이동용 (있으면 사용)

            // 표시용
            title: label,
            type,
            cable: !!x.cable,

            // 날짜
            rentDate: x.rented_on ? String(x.rented_on).slice(0, 10) : null,
            dueDate: x.due_on ? String(x.due_on).slice(0, 10) : null,
            returnDate: x.returned_on ? String(x.returned_on).slice(0, 10) : null,

            // 상태
            status: mapApiStatusToUi(x.status),

            // 기존 UI용
            depositPaid: true,
            depositRefunded: false,
            thumb: null,
          };
        });

        setRents(mapped);
      } catch (e) {
        console.error(e);
        if (e?.status === 401) navigate("/login", { replace: true });
        else setErr(e?.message || "대여 이력 불러오기에 실패했습니다.");
        setRents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRents();
  }, [navigate]);

  const openCancel = (item) =>
    setConfirm({
      open: true,
      id: item.id,
      title: `${item.title} 대여 신청을 취소하시겠습니까?`,
    });

  const doCancel = () => {
    // ⚠️ “예약 취소 API”가 아직 없어서 UI에서만 제거
    const id = confirm.id;
    const next = rents.filter((r) => r.id !== id);
    setRents(next);
    setConfirm({ open: false, id: null, title: "" });
    setInfo({ open: true, title: "알림", text: "취소되었습니다. (현재는 UI만 변경)" });
  };

  /**
   * ✅ 클릭 시 이동 규칙 (핵심!)
   * - rental_id 있으면 → 세부 대여 이력(/mypage/rentals/:rentalId)
   * - rental_id 없고 reservation_id 있으면 → 세부 예약 이력(/mypage/rents/:reservationId)
   * - 둘 다 없으면 이동 안 함
   *
   * (원하면 reserved/returned는 막고 renting/overdue만 허용하는 것도 가능)
   */
  const goDetailIfNeeded = (item) => {
    const { currentStatus } = computeView(item);

    // ✅ 네가 “예약중/반납완료는 눌러도 상세 안 들어가게” 유지하고 싶으면 여기 유지
    if (!(currentStatus === "renting" || currentStatus === "overdue")) return;

    if (item.rental_id) {
      navigate(`/mypage/rentals/${item.rental_id}`);
      return;
    }
    if (item.reservation_id) {
      navigate(`/mypage/rents/${item.reservation_id}`);
      return;
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
    const title = item.title === typeLabel ? item.title : `${typeLabel} · ${item.title}`;

    return (
      <div className="RentCard" onClick={() => goDetailIfNeeded(item)} role="button">
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
          {currentStatus === "reserved" && `보증금 입금 완료 · 픽업 전${item.cable ? " · 케이블 O" : ""}`}
          {currentStatus === "renting" && `보증금 입금 완료 · 픽업 완료${item.cable ? " · 케이블 O" : ""}`}
          {currentStatus === "returned" && "기한 내 반납 완료"}
          {currentStatus === "overdue" && "반납 기한 경과"}
        </div>
      </div>
    );
  };

  const sortedAll = useMemo(() => {
    return [...rents].sort(byStatus);
  }, [rents]);

  return (
    <main className="MyPageWrap">
      <header className="MPHeader">
        <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">
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
            {[user?.name, user?.username && `(${user.username})`].filter(Boolean).join(" ")}
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

      {loading && <p style={{ padding: 16 }}>불러오는 중…</p>}
      {err && <p style={{ padding: 16, color: "#b91c1c" }}>{err}</p>}

      {!loading && !err && (
        <section className="Card grid-12">
          {sortedAll.length === 0
            ? renderCard(null, "내역")
            : sortedAll.map((item) => <div key={item.id}>{renderCard(item)}</div>)}
        </section>
      )}

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