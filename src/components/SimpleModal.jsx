export default function SimpleModal({ open, title, onClose, onConfirm, confirmText = '확인', children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="닫기">✕</button>
        </header>
        <div className="modal-body">{children}</div>
        <footer className="modal-footer">
          {onConfirm ? (
            <button className="modal-ok" onClick={onConfirm}>{confirmText}</button>
          ) : (
            <button className="modal-ok" onClick={onClose}>확인</button>
          )}
        </footer>
      </div>
    </div>
  );
}
