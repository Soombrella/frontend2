// src/mypage/MyPageRentDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./mypage.css";
import BottomTab from "../components/BottomTab";
import "../components/BottomTab.css";
import umbrellaImg from "../img/umbrella.jpg";
import powerbankImg from "../img/powerbank.jpg";
import { getRentalDetailApi } from "../api/mypage";

 const statusLabelFromApi = (s) =>
  s === "RESERVED" ? "예약중"
  : s === "RENTING" ? "대여중"
  : s === "OVERDUE" ? "연체중"
  : s === "RETURNED" ? "반납완료"
  : s || "-";

export default function MyPageRentDetail() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErr("");
      try {
        const d = await getRentalDetailApi(reservationId);
        setData(d);
      } catch (e) {
        console.error(e);
        if (e?.status === 401) navigate("/login", { replace: true });
        else setErr(e?.message || "상세 조회 실패");
      } finally {
        setLoading(false);
      }
    };
    if (reservationId) run();
  }, [reservationId, navigate]);

  const ui = useMemo(() => {
    if (!data) return null;

    const category = data?.item?.category_name; // "우산" or "보조배터리"
    const isBattery = category === "보조배터리";

    return {
      title: category || "대여 상세",
      typeLabel: isBattery ? "보조배터리" : "우산",
      heroImg: isBattery ? powerbankImg : umbrellaImg,
      cable: !!data?.item?.cable, // 보조배터리면 true/false
      status: statusLabelFromApi(data?.reservation_info?.status),
      pickupOn: data?.reservation_info?.pickup_on || "-",
      depositPaid: data?.deposit?.deposit_paid ? "예" : "아니오",
      depositRefunded: data?.deposit?.deposit_refunded ? "예" : "아니오",
      reservationId: data?.reservation_id,
    };
  }, [data]);

  if (loading) {
    return (
      <main className="MyPageWrap">
        <header className="MPHeader">
          <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
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
          <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
          <h1 className="MPTitle">대여 상세</h1>
          <div style={{ width: 24 }} />
        </header>
        <div style={{ padding: 16, color: "#b91c1c" }}>{err || "내역을 찾을 수 없습니다."}</div>
        <BottomTab />
      </main>
    );
  }

  const rows = [
    ["예약 ID", String(ui.reservationId ?? "-")],
    ["품목", ui.title],
    ...(ui.typeLabel === "보조배터리" ? [["케이블 대여 여부", ui.cable ? "예" : "아니오"]] : []),
    ["대여 상태", ui.status],
    ["픽업 예정일", ui.pickupOn],
    ["보증금 입금 여부", ui.depositPaid],
    ["보증금 환급 여부", ui.depositRefunded],
  ];

  return (
    <main className="MyPageWrap">
      <header className="MPHeader">
        <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
        <h1 className="MPTitle">대여 상세</h1>
        <div style={{ width: 24 }} />
      </header>

      <section className="Card detail">
        <div className="DetailThumb">
          <img className="DetailImg" src={ui.heroImg} alt={ui.typeLabel} loading="lazy" />
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