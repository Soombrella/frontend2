// src/mypage/MyPageRentalHistoryDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./mypage.css";
import BottomTab from "../components/BottomTab";
import "../components/BottomTab.css";

import umbrellaImg from "../img/umbrella.jpg";
import powerbankImg from "../img/powerbank.jpg";

import { getRentalHistoryDetailApi } from "../api/mypage";

const statusLabelFromApi = (s) =>
  s === "RESERVED"
    ? "예약중"
    : s === "RENTING"
    ? "대여중"
    : s === "OVERDUE"
    ? "연체중"
    : s === "RETURNED"
    ? "반납완료"
    : s || "-";

function normalizeCategory(raw) {
  const c = String(raw || "").trim().toLowerCase();

  if (c === "umbrella") return { type: "umbrella", label: "우산" };
  if (c === "powerbank") return { type: "battery", label: "보조배터리" };

  if (c.includes("우산")) return { type: "umbrella", label: "우산" };
  if (c.includes("배터리") || c.includes("보조"))
    return { type: "battery", label: "보조배터리" };

  // fallback
  return { type: "umbrella", label: raw || "우산" };
}

export default function MyPageRentalHistoryDetail() {
  const { rentalId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErr("");
      try {
        const d = await getRentalHistoryDetailApi(rentalId);
        setData(d);
      } catch (e) {
        console.error(e);
        if (e?.status === 401) navigate("/login", { replace: true });
        else setErr(e?.message || "상세 조회 실패");
      } finally {
        setLoading(false);
      }
    };

    if (rentalId) run();
  }, [rentalId, navigate]);

  const ui = useMemo(() => {
    if (!data) return null;

    // 명세 기준(세부 대여 이력 조회):
    // data: { rental_id, reservation_id, item{...}, rental_info{...}, deposit{...} }
    const catRaw = data?.item?.category_name;
    const { type, label } = normalizeCategory(catRaw);
    const isBattery = type === "battery";

    return {
      rentalId: data?.rental_id ?? rentalId,
      reservationId: data?.reservation_id ?? null,

      typeLabel: label,
      title: label,
      heroImg: isBattery ? powerbankImg : umbrellaImg,

      cable: !!data?.item?.cable,

      status: statusLabelFromApi(data?.rental_info?.status),
      rentedOn: data?.rental_info?.rented_on || "-",
      dueOn: data?.rental_info?.due_on || "-",
      returnedOn: data?.rental_info?.returned_on || "-",
      proxyReturn: data?.rental_info?.proxy_return ? "예" : "아니오",

      depositPaid: data?.deposit?.deposit_paid ? "예" : "아니오",
      depositRefunded: data?.deposit?.deposit_refunded ? "예" : "아니오",
    };
  }, [data, rentalId]);

  if (loading) {
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
          <h1 className="MPTitle">대여 상세</h1>
          <div style={{ width: 24 }} />
        </header>

        <div style={{ padding: 16 }}>불러오는 중...</div>
        <BottomTab />
      </main>
    );
  }

  if (err || !ui) {
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
          <h1 className="MPTitle">대여 상세</h1>
          <div style={{ width: 24 }} />
        </header>

        <div style={{ padding: 16, color: "#b91c1c" }}>
          {err || "내역을 찾을 수 없습니다."}
        </div>
        <BottomTab />
      </main>
    );
  }

  const rows = [
    ["대여 ID", String(ui.rentalId ?? "-")],
    ...(ui.reservationId != null
      ? [["예약 ID", String(ui.reservationId)]]
      : []),
    ["품목", ui.title],
    ...(ui.typeLabel === "보조배터리"
      ? [["케이블 대여 여부", ui.cable ? "예" : "아니오"]]
      : []),

    ["대여 상태", ui.status],
    ["대여일", ui.rentedOn],
    ["반납예정일", ui.dueOn],
    ["실제 반납일", ui.returnedOn],
    ["대리 반납 여부", ui.proxyReturn],

    ["보증금 입금 여부", ui.depositPaid],
    ["보증금 환급 여부", ui.depositRefunded],
  ];

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
        <h1 className="MPTitle">대여 상세</h1>
        <div style={{ width: 24 }} />
      </header>

      <section className="Card detail">
        <div className="DetailThumb">
          <img
            className="DetailImg"
            src={ui.heroImg}
            alt={ui.typeLabel}
            loading="lazy"
          />
        </div>

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