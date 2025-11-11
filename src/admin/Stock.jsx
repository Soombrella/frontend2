import React, { useMemo, useState } from "react";
import "./Stock.css";
import AdminBottomTab from "./AdminBottomTab";

/** 상태 옵션 */
const STATUS_LIST = ["사용가능", "대여중", "반납완료", "분실 및 고장"];
const ITEM_TYPES = ["우산", "보조배터리"];

/** 더미 데이터 */
const SEED = [
  { id: 1, itemType: "우산", code: "UM-0001", status: "사용가능" },
  { id: 2, itemType: "우산", code: "UM-0002", status: "대여중" },
  { id: 3, itemType: "보조배터리", code: "PB-0101", status: "반납완료" },
  { id: 4, itemType: "보조배터리", code: "PB-0102", status: "분실 및 고장" },
  { id: 5, itemType: "우산", code: "UM-0003", status: "사용가능" },
];

/** 상태별 알약 배지 클래스 */
function pillClass(status) {
  switch (status) {
    case "사용가능":
      return "pill pill-green";
    case "대여중":
      return "pill pill-blue";
    case "반납완료":
      return "pill pill-gray";
    case "분실 및 고장":
      return "pill pill-red";
    default:
      return "pill";
  }
}

export default function Stock() {
  const [rows, setRows] = useState(SEED);
  const [itemFilter, setItemFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const okItem = itemFilter === "전체" ? true : r.itemType === itemFilter;
      const okStatus = statusFilter === "전체" ? true : r.status === statusFilter;
      return okItem && okStatus;
    });
  }, [rows, itemFilter, statusFilter]);

  const updateRow = (id, next) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  };

  return (
    <div className="stock-page">
      <header className="stock-header">
        <button className="back-btn" onClick={() => window.history.back()} aria-label="뒤로가기">
          ←
        </button>
        <h1>재고 관리</h1>

        <div className="filters">
          <label className="filter">
            <span>대여품</span>
            <select value={itemFilter} onChange={(e) => setItemFilter(e.target.value)}>
              <option value="전체">전체</option>
              {ITEM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="filter">
            <span>상태</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="전체">전체</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="table-wrap">
        <table className="stock-table">
          <thead>
            <tr>
              <th>항목</th>
              <th>번호</th>
              <th>상태</th>
              <th className="col-action">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.itemType}</td>
                <td className="mono">{r.code}</td>
                <td>
                  <span className={pillClass(r.status)}>{r.status}</span>
                </td>
                <td className="col-action">
                  <div className="changer">
                    <select value={r.status} onChange={(e) => updateRow(r.id, e.target.value)}>
                      {STATUS_LIST.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn-outline"
                      onClick={() => alert("상태가 저장되었습니다. (API 연동 필요)")}
                    >
                      저장
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <AdminBottomTab />
    </div>
  );
}