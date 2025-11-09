import React, { useEffect } from "react";
import "./NoticeModal.css";

export default function NoticeModal({ open, onClose }) {

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button type="button" className="modal-close" aria-label="닫기" onClick={onClose}>
          ×
        </button>

        <div className="modal-body">
          <p className="accent strong">
            보증금은 계좌이체로만 가능합니다.<br />
            <span className="accent small">*보증금 입금 계좌: 00은행 {`{계좌번호}`}</span><br />
            오시기 전 입금 부탁드립니다.
          </p>

          <ul className="bullet">
            <li>대여 가능 물품의 개수는 1인당 물품별 1개로 제한되어 있습니다.</li>
            <li>케이블은 보조배터리 대여 시에만 옵션으로 대여 가능합니다.</li>
            <li>대여 시 학생증을 지참해 주시기 바랍니다.</li>
          </ul>

          <p className="accent">
            <b>대여 기간은 대여일을 포함하여 3일</b>입니다.<br />
            단, 상근을 진행하지 않는 날은 대여 기간에 포함되지 않습니다.<br />
            환급 기간 초과 및 물품 분실 또는 고장의 경우 보증금 환급이 불가합니다.
          </p>

          <p>접근성 지원은 예약하신 시간에만 이용할 수 있습니다.</p>

          <p>
            반납 시 대리인을 통한 반납도 가능합니다.<br />
            상근 진행일의 <b className="accent">상근 시간(10:20~16:30)</b><br />
            이외에는 반납이 불가합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
