// src/signup/Signup.jsx
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupApi, loginApi } from "../api/auth"; // ✅ signup + login
import { useAuth } from "../auth/AuthContext";     // ✅ 자동 로그인 반영용

// 🔹 환급계좌용 은행 목록
const BANKS = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "카카오뱅크",
  "토스뱅크",
  "우체국",
  "신협은행",
  "IM뱅크",
  "광주은행",
  "부산은행",
  "기업은행",
  "케이뱅크",
  "새마을금고",
  "SC제일",
  "경남은행",
  "수협",
  "제주은행",
];

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ AuthContext의 login(token, user)

  const [form, setForm] = useState({
    name: "",
    dept: "",
    username: "", // student_no
    phone: "",
    password: "",
    email: "",
    bank: "", // account_bank
    accountNumber: "", // account_num
    birth: "", // 명세에 없으니 서버로는 안 보냄
  });

  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isEmailValid =
    form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const isPwValid =
    /[A-Za-z]/.test(form.password) &&
    /\d/.test(form.password) &&
    form.password.length >= 8;

  const requiredOk = Boolean(
    form.name &&
      form.dept &&
      form.username &&
      form.phone &&
      form.password &&
      form.email &&
      form.bank &&
      form.accountNumber &&
      isPwValid &&
      isEmailValid
  );

  const canNext = requiredOk && agree && !submitting;

  const handleNext = async () => {
    if (!canNext) return;

    setSubmitting(true);
    try {
      // ✅ 백엔드 명세에 맞게 payload 매핑
      const payload = {
        name: form.name.trim(),
        department: form.dept,
        student_no: form.username.trim(),
        phone: form.phone.trim(),
        password: form.password,
        email: form.email.trim(),
        account_bank: form.bank,
        account_num: form.accountNumber.trim(),
      };

      // 1) 회원가입
      await signupApi(payload);

      // 2) (선택) 회원가입 성공 → 바로 로그인해서 토큰 저장 + 전역 상태 반영
      const loginRes = await loginApi(payload.student_no, payload.password);
      login(loginRes.token, loginRes.user);

      alert("회원가입이 완료되었습니다.");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert(err?.message || "회원가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="SignupWrap">
      <header className="SignupHeader">
        <div className="HeaderLeft">
          <button
            className="BackBtn"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="Title">계정 정보를 입력해주세요</h1>
        </div>

        <button
          className="NextBtn"
          type="button"
          disabled={!canNext}
          onClick={handleNext}
        >
          {submitting ? "처리 중..." : "다음으로"}
        </button>
      </header>

      <form className="Form" onSubmit={(e) => e.preventDefault()}>
        <label className="Label">이름</label>
        <input
          className="Input"
          name="name"
          value={form.name}
          onChange={onChange}
        />

        <label className="Label">학과</label>
        <div className="SelectWrap">
          <select
            className="Select"
            name="dept"
            value={form.dept}
            onChange={onChange}
          >
            <option value="">학과 선택</option>
            <option>한국어문학부</option>
            <option>역사문화학과</option>
            <option>프랑스언어문화학과</option>
            <option>중어중문학부</option>
            <option>독일언어문화학과</option>
            <option>일본학과</option>
            <option>문헌정보학과</option>
            <option>문화관광외식학부 문화관광학전공</option>
            <option>문화관광외식학부 르꼬르동블루외식경영전공</option>
            <option>교육학부</option>
            <option>화학과</option>
            <option>생명시스템학부</option>
            <option>수학과</option>
            <option>통계학과</option>
            <option>체육교육과</option>
            <option>무용과</option>
            <option>화공생명공학부</option>
            <option>인공지능학부</option>
            <option>지능형전자시스템전공</option>
            <option>신소재물리전공</option>
            <option>소프트웨어학부 컴퓨터과학전공</option>
            <option>소프트웨어학부 데이터사이언스전공</option>
            <option>기계시스템학부</option>
            <option>기초공학부</option>
            <option>첨단공학부</option>
            <option>가족자원경영학과</option>
            <option>아동복지학부</option>
            <option>의류학과</option>
            <option>식품영양학과</option>
            <option>정치외교학과</option>
            <option>행정학과</option>
            <option>홍보광고학과</option>
            <option>소비자경제학과</option>
            <option>사회심리학과</option>
            <option>경제학부</option>
            <option>경영학부</option>
            <option>피아노과</option>
            <option>관현악과</option>
            <option>성악과</option>
            <option>작곡과</option>
            <option>약학부</option>
            <option>시각영상디자인과</option>
            <option>산업디자인과</option>
            <option>환경디자인과</option>
            <option>공예과</option>
            <option>회화과</option>
            <option>자유전공학부</option>
            <option>글로벌융합학부</option>
            <option>글로벌협력전공</option>
            <option>앙트러프러너십전공</option>
            <option>영어영문학전공</option>
            <option>테슬(TESL)전공</option>
            <option>미디어학부</option>
          </select>
          <span className="Chevron">▾</span>
        </div>

        <label className="Label">학번(아이디)</label>
        <input
          className="Input"
          name="username"
          value={form.username}
          onChange={onChange}
        />

        <label className="Label">전화번호</label>
        <input
          className="Input"
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="010-0000-0000"
        />

        <label className="Label">비밀번호</label>
        <input
          className="Input"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="8자리 이상, 영문+숫자"
        />

        <label className="Label">이메일</label>
        <input
          className="Input"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="example@sookmyung.ac.kr"
        />

        <label className="Label">환급계좌</label>
        <div className="Row">
          <div
            className="SelectWrap"
            style={{ flex: "0 0 110px", maxWidth: "110px" }}
          >
            <select
              className="Select"
              name="bank"
              value={form.bank}
              onChange={onChange}
            >
              <option value="">은행 선택</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <span className="Chevron">▾</span>
          </div>

          <input
            className="Input"
            style={{ flex: "1 1 auto" }}
            name="accountNumber"
            value={form.accountNumber}
            onChange={onChange}
            placeholder="계좌번호만 입력"
          />
        </div>

        <div className="AgreeRow">
          <label className="CheckLabel">
            <input
              type="checkbox"
              className="CheckBox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>약관동의</span>
          </label>
        </div>
      </form>
    </main>
  );
}