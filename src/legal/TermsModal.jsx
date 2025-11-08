import Modal from "../components/Modal";

export default function TermsModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="서비스 이용 약관">
      {/* 👉 약관 내용 여기에 작성 */}
      <p>여기에 약관 내용을 자유롭게 넣어주세요.</p>
    </Modal>
  );
}
