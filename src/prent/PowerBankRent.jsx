import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BottomTab from "../components/BottomTab";
import "./PowerBankRent.css";

const PowerBankRent = () => {
  const navigate = useNavigate();

  const [visitDate, setVisitDate] = useState(null);
  const [isProxyReturn, setIsProxyReturn] = useState(null);
  const [hasCable, setHasCable] = useState(null);
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const today = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d;
  }, []);

  // 반납 마감(오늘부터 3일 뒤 16:30 고정)
  const dueDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(16, 30, 0, 0);
    return d;
  }, []);

  const formattedDueDate = `${dueDate.getMonth() + 1}월 ${dueDate.getDate()}일`;
  const daysLeft = Math.ceil(
    (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const deposit = hasCable === true ? 8000 : 6000;

  const handleSubmit = () => {
    if (!visitDate || isProxyReturn === null || hasCable === null) {
      alert("모든 항목을 입력해주세요!");
      return;
    }
    setShowSubmitModal(true);
  };

  return (
    <div className="umbrella-container">
      <div className="umbrella-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h2>보조배터리 대여</h2>
        <button className="procedure-btn" onClick={() => setShowProcedureModal(true)}>
          대여절차
        </button>
      </div>

      <p className="umbrella-info">
        현재 보조배터리 재고 수는 〇이며,<br />
        <strong>{formattedDueDate}, 16:30까지</strong> 반납하여야 합니다.
      </p>
      <p className="umbrella-notice">
        정보 미기재 및 오기재 시 대여가 어려울 수 있습니다.
      </p>

      {/* 방문 예정일 */}
      <div className="umbrella-field">
        <label>방문 예정일</label>
        <DatePicker
          selected={visitDate}
          onChange={(d) => setVisitDate(d)}
          minDate={today}
          maxDate={maxDate}
          placeholderText="날짜를 선택하세요"
          dateFormat="yyyy-MM-dd"
          className="date-picker"
        />
      </div>

      {/* 대리 반납 여부 */}
      <div className="umbrella-field checkbox-group">
        <label>대리 반납 여부</label>
        <div role="radiogroup" aria-label="대리 반납 여부">
          <label>
            <input
              type="radio"
              name="proxy"
              checked={isProxyReturn === true}
              onChange={() => setIsProxyReturn(true)}
            />
            O
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="radio"
              name="proxy"
              checked={isProxyReturn === false}
              onChange={() => setIsProxyReturn(false)}
            />
            X
          </label>
        </div>
      </div>

      {/* 케이블 여부 */}
      <div className="umbrella-field checkbox-group">
        <label>케이블 여부 (보증금 +2000원)</label>
        <div role="radiogroup" aria-label="케이블 여부">
          <label>
            <input
              type="radio"
              name="cable"
              checked={hasCable === true}
              onChange={() => setHasCable(true)}
            />
            O
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="radio"
              name="cable"
              checked={hasCable === false}
              onChange={() => setHasCable(false)}
            />
            X
          </label>
        </div>
      </div>

      <p className="deposit-info">
        보증금 입금 계좌({deposit.toLocaleString()}원): 00은행 [계좌번호]
      </p>

      <button className="submit-btn" onClick={handleSubmit}>
        신청완료
      </button>

      {/* 대여절차 모달 */}
      {showProcedureModal && (
        <div className="modal-overlay" onClick={() => setShowProcedureModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>대여 절차 안내</h3>
            <ol>
              <li>SoomBrella에서 대여 신청하기</li>
              <li>안내된 계좌로 보증금 입금하기</li>
              <li>학생회관 408호 총학생회실에서 대여하기</li>
              <li>대여 기간(3일) 내에 반납하기</li>
              <li>보증금 환불받기</li>
            </ol>
            <p><strong>보증금 입금 후 대여하지 않았을 경우</strong><br />3일 후 자동취소, 보증금 환급</p>
            <p><strong>보증금 입금하지 않았을 경우</strong><br />당일 자동 취소</p>
            <button onClick={() => setShowProcedureModal(false)}>닫기</button>
          </div>
        </div>
      )}

      {/* 신청완료 모달 */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>보조배터리 대여 기간이 {daysLeft}일 남았습니다.</p>
            <p>{`${dueDate.getMonth() + 1}/${dueDate.getDate()}`}까지 반납 부탁드립니다.</p>
            <div className="refund-info">
              <p><strong>보조배터리</strong><br />1~3일 차 반납(대여 기간 내): 8,000원 (전액 환급)</p>
              <p style={{ marginTop: 6 }}>선택 보증금: {deposit.toLocaleString()}원</p>
            </div>
            <button onClick={() => setShowSubmitModal(false)}>확인</button>
          </div>
        </div>
      )}

      <BottomTab />
    </div>
  );
};

export default PowerBankRent;