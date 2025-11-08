import React, { useEffect } from "react";
import "./NoticeModal.css"; // 기존 모달 CSS 재사용

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-card">
        <button type="button" className="modal-close" aria-label="닫기" onClick={onClose}>×</button>
        {title && <h2 style={{margin:'2px 0 12px', textAlign:'center'}}>{title}</h2>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
