export default function PriceTable() {
  return (
    <section className="PriceTable">
      {/* 우산 */}
      <div className="TableCard">
        <div className="Pill pill-yellow">우산</div>
        <table className="Table">
          <thead>
            <tr>
              <th>1~3일 차 반납<br/>(대여 기간 내)</th>
              <th>4일 차 반납</th>
              <th>5일 차 반납</th>
              <th>6일 차 이후 반납</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>6,000원(전액)</td>
              <td>4,000원</td>
              <td>2,000원</td>
              <td>환급 없음</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 보조배터리 */}
      <div className="TableCard">
        <div className="Pill pill-blue">보조배터리</div>
        <table className="Table">
          <thead>
            <tr>
              <th>1~3일 차 반납<br/>(대여 기간 내)</th>
              <th>4일 차 반납</th>
              <th>5일 차 반납</th>
              <th>6일 차 이후 반납</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>8,000원(전액)</td>
              <td>6,000원</td>
              <td>4,000원</td>
              <td>환급 없음</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 안내문 - 두 문단을 같은 들여쓰기 박스(Notes)로 감쌈 */}
      <div className="Notes">
        <p className="Note">
          - 케이블은 보조배터리와 <b>함께 반납</b>해야 하며, 반납 시 <b>2,000원 환급</b>됩니다.
          <br/>(분실 또는 6일차 이후 반납 시 환급 불가)
        </p>
        <p className="Note warning">
          * 대여 물품 분실, 고장의 경우 위 기준과 상관없이 환급 불가합니다.
        </p>
      </div>
    </section>
  );
}
