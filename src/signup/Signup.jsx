// src/signup/Signup.jsx
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

// 로컬 저장 키
const USERS_KEY = 'sb_users';
const loadUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '', dept: '', username: '', phone: '', password: '', email: '', account: '', birth: ''
  });
  const [idChecked, setIdChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [agree, setAgree] = useState(false); // 약관 동의

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'username') setIdChecked(false);
  };

  // ✅ 백엔드 없이 로컬에서 아이디(학번) 중복확인
  const checkId = async () => {
    if (!form.username.trim()) return;
    setChecking(true);
    try {
      const users = loadUsers();
      const available = !users.some(u => u.username === form.username.trim());
      setIdChecked(available);
      if (!available) alert('이미 사용 중인 아이디(학번)입니다.');
      else alert('사용 가능한 아이디(학번)입니다.');
    } finally {
      setChecking(false);
    }
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPwValid = /[A-Za-z]/.test(form.password) && /\d/.test(form.password) && form.password.length >= 8;

  const requiredOk = Boolean(
    form.name && form.dept && form.username && form.phone &&
    form.password && form.email && form.account && isPwValid && isEmailValid
  );

  const canNext = requiredOk && idChecked && agree; // 동의까지 포함

  // ✅ 백엔드 없이 로컬 회원가입 + 자동 로그인
  const handleNext = () => {
    if (!canNext) return;

    const users = loadUsers();
    // 안전망: 혹시 중복확인 이후에 누군가 추가됐을 수 있으니 다시 한 번 체크
    if (users.some(u => u.username === form.username.trim())) {
      alert('이미 사용 중인 아이디(학번)입니다. 다시 확인해주세요.');
      setIdChecked(false);
      return;
    }

    // 저장 (⚠️ 비밀번호 평문 저장: 개발/디자인 확인용 전용)
    const userToSave = {
      username: form.username.trim(),
      password: form.password,
      name: form.name.trim(),
      email: form.email.trim(),
      dept: form.dept,
      phone: form.phone.trim(),
      account: form.account.trim(),
      birth: form.birth || '',
    };
    users.push(userToSave);
    saveUsers(users);

    // 자동 로그인용 안전 객체
    const { password, ...safeUser } = userToSave;
    login(`dev-${Date.now()}`, safeUser);

    alert('회원가입이 완료되었습니다');
    navigate('/');   // 완료 후 메인으로 이동 (원하면 '/mypage'로)
  };

  return (
    <main className="SignupWrap">
      <header className="SignupHeader">
        <div className="HeaderLeft">
          <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
          <h1 className="Title">계정 정보를 입력해주세요</h1>
        </div>
        <button
          className="NextBtn"
          type="button"
          disabled={!canNext}
          onClick={handleNext}
        >
          다음으로
        </button>
      </header>

      <form className="Form" onSubmit={(e)=>e.preventDefault()}>
        <label className="Label">이름</label>
        <input className="Input" name="name" value={form.name} onChange={onChange} />

        <label className="Label">학과</label>
        <div className="SelectWrap">
          <select className="Select" name="dept" value={form.dept} onChange={onChange}>
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
        <div className="Row">
          <input className="Input" name="username" value={form.username} onChange={onChange} />
          <button type="button" className="SmallBtn" onClick={checkId} disabled={checking}>
            {checking ? '확인중…' : '중복확인'}
          </button>
        </div>

        <label className="Label">전화번호</label>
        <input className="Input" name="phone" value={form.phone} onChange={onChange} placeholder="010-0000-0000" />

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
        <input className="Input" name="account" value={form.account} onChange={onChange} placeholder="은행명+계좌번호" />

        {/* (선택) 생년월일 */}
        {/* <label className="Label">생년월일</label>
        <input className="Input" name="birth" value={form.birth} onChange={onChange} placeholder="YYYY-MM-DD" /> */}

        {/* 약관 동의 */}
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
