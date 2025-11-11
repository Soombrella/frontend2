import React, { useMemo, useState } from "react";
import "./Home.css";
import AdminBottomTab from "./AdminBottomTab";

/** ─────────────────────────────────────────────────
 *  (1) 상태 정의
 *     - 3개 큰 그룹(파랑/초록/빨강) 안에서 명도만 달라지는 배지
 * ───────────────────────────────────────────────── */
export const STATUS_GROUPS = {
  // 파랑 (대여/결제 흐름)
  BLUE: ["입금대기", "입금완료", "대여중"],
  // 초록 (환급 흐름)
  GREEN: ["환급전", "환급완료"],
  // 빨강 (연체/미반납 흐름)
  RED: ["연체중", "일부환급완료", "미반납"],
};

const ALL_FINE_STATUSES = [
  ...STATUS_GROUPS.BLUE,
  ...STATUS_GROUPS.GREEN,
  ...STATUS_GROUPS.RED,
];

/** 굵은 상태 필터(상단 드롭다운) → 세부 배지상태 매핑 */
const COARSE_STATUS_MAP = {
  전체: ALL_FINE_STATUSES,
  대여중: ["대여중"],
  반납: ["환급전", "환급완료", "일부환급완료"], // 반납 프로세스류
  연체: ["연체중", "미반납"], // 문제 상태류
};

/** 배지 색상 클래스 선택 */
function badgeClassByStatus(status) {
  if (STATUS_GROUPS.BLUE.includes(status)) {
    // 명도: 1(연한) ~ 3(진함) 순서 느낌으로 매핑
    if (status === "입금대기") return "pill pill-blue tone-1";
    if (status === "입금완료") return "pill pill-blue tone-2";
    return "pill pill-blue tone-3"; // 대여중
  }
  if (STATUS_GROUPS.GREEN.includes(status)) {
    if (status === "환급전") return "pill pill-green tone-1";
    return "pill pill-green tone-3"; // 환급완료
  }
  // RED
  if (status === "연체중") return "pill pill-red tone-2";
  if (status === "일부환급완료") return "pill pill-red tone-1";
  return "pill pill-red tone-3"; // 미반납
}

/** 데모용 더미 데이터 */
const SEED = [
  {
    id: 1,
    name: "김학생",
    rentAt: "2025-11-05",
    returnAt: "-",
    itemType: "우산",
    status: "대여중",
    refundAccount: "국민 123456-00-000000",
    overdueDays: 0,
  },
  {
    id: 2,
    name: "이학생",
    rentAt: "2025-11-01",
    returnAt: "2025-11-02",
    itemType: "보조배터리",
    status: "환급전",
    refundAccount: "신한 110-000-000000",
    overdueDays: 0,
  },
  {
    id: 3,
    name: "박학생",
    rentAt: "2025-10-28",
    returnAt: "-",
    itemType: "우산",
    status: "연체중",
    refundAccount: "카카오 3333-00-0000000",
    overdueDays: 4,
  },
  {
    id: 4,
    name: "최학생",
    rentAt: "2025-11-07",
    returnAt: "2025-11-08",
    itemType: "보조배터리",
    status: "환급완료",
    refundAccount: "우리 1002-000-000000",
    overdueDays: 0,
  },
];

/** 행별 상태 변경을 위한 셀렉트에 쓸 옵션 */
const STATUS_OPTIONS = [
  { label: "— 파랑(결제/대여) —", options: STATUS_GROUPS.BLUE },
  { label: "— 초록(환급) —", options: STATUS_GROUPS.GREEN },
  { label: "— 빨강(연체/문제) —", options: STATUS_GROUPS.RED },
];

export default function Home() {
  const [itemFilter, setItemFilter] = useState("전체"); // 전체/우산/보조배터리
  const [coarseStatus, setCoarseStatus] = useState("전체"); // 전체/대여중/반납/연체
  const [rows, setRows] = useState(SEED);

  /** 상단 필터 적용 */
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const itemOk =
        itemFilter === "전체" ? true : r.itemType === itemFilter;

      const fineSet = COARSE_STATUS_MAP[coarseStatus];
      const statusOk = fineSet.includes(r.status);

      return itemOk && statusOk;
    });
  }, [rows, itemFilter, coarseStatus]);

  /** 상태 변경 핸들러 */
  const updateStatus = (id, nextStatus) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: nextStatus } : r
      )
    );
  };

  return (
    <div className="admin-home">
      <header className="admin-home__header">
        <button className="back-btn" aria-label="뒤로가기" onClick={() => window.history.back()}>
          ←
        </button>
        <h1>학생 대여 상태 관리</h1>

        <div className="filters">
          <label className="filter">
            <span>대여품</span>
            <select
              value={itemFilter}
              onChange={(e) => setItemFilter(e.target.value)}
            >
              <option value="전체">전체</option>
              <option value="우산">우산</option>
              <option value="보조배터리">보조배터리</option>
            </select>
          </label>

          <label className="filter">
            <span>상태</span>
            <select
              value={coarseStatus}
              onChange={(e) => setCoarseStatus(e.target.value)}
            >
              <option value="전체">전체</option>
              <option value="대여중">대여중</option>
              <option value="반납">반납</option>
              <option value="연체">연체</option>
            </select>
          </label>
        </div>
      </header>

      <section className="table-wrap">
        <table className="status-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>대여일</th>
              <th>반납일</th>
              <th>상태</th>
              <th>환불계좌</th>
              <th className="col-action">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const pillClass = badgeClassByStatus(r.status);
              const showTooltip = r.status === "연체중" && r.overdueDays > 0;
              return (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.rentAt}</td>
                  <td>{r.returnAt}</td>
                  <td>
                    <span
                      className={`${pillClass} ${showTooltip ? "has-tooltip" : ""}`}
                      data-tooltip={showTooltip ? `연체 ${r.overdueDays}일` : ""}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="mono">{r.refundAccount}</td>
                  <td className="col-action">
                    {/* 상태 변경 셀렉트 + 적용 버튼 */}
                    <div className="changer">
                      <select
                        defaultValue={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((grp) => (
                          <optgroup key={grp.label} label={grp.label}>
                            {grp.options.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <button
                        className="btn-outline"
                        onClick={() => alert("상태가 저장되었습니다. (실서버 연동 필요)")}
                      >
                        저장
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
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