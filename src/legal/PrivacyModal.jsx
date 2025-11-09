import Modal from "../components/Modal";

export default function PrivacyModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="개인정보 처리방침">
      <p>여기에 개인정보 처리방침 내용을 자유롭게 넣어주세요.</p>
    </Modal>
  );
}
