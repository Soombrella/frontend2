// src/mypage/MyPage.jsx
import { useEffect, useRef, useState } from "react";
import { getMyInfoApi } from "../api/mypage";
import { updateMyInfoApi } from "../api/mypage";
import "./mypage.css";
import { useNavigate, Link } from "react-router-dom";
import BottomTab from "../components/BottomTab";
import "../components/BottomTab.css";
import SimpleModal from "../components/SimpleModal";
import { useAuth } from "../auth/AuthContext";
import { MAJORS } from "../data/majors";

// 비밀번호 변경용 모의 이메일 코드 저장 키
const CODE_KEY = "sb_pwd_code";

export default function MyPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth() ?? {};

  const v = (x) => (x ? x : "");

  /* ---------------- 프로필 수정 모달 ---------------- */
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || "",
    dept: user?.dept || "",
  });
  const [err, setErr] = useState("");

  // ✅ 무한 호출 방지용 (StrictMode에서도 1회만 실행)
  const fetchedRef = useRef(false);

  // ✅ 페이지 진입 시 내 정보 불러오기
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchMyInfo = async () => {
      try {
        setErr("");
        // ✅ getMyInfoApi는 "유저 객체"를 바로 리턴함 (res.data 아님)
        const d = await getMyInfoApi();

        // AuthContext에 서버 데이터 반영
        if (typeof updateUser === "function") {
          await updateUser(d);
        }

        // 프로필 수정 폼 동기화
        setForm({
          email: d.email || "",
          dept: d.dept || "",
        });
      } catch (e) {
        console.error(e);
        if (e?.status === 401) {
          navigate("/login", { replace: true });
        } else {
          setErr(e?.message || "내 정보 불러오기에 실패했습니다.");
        }
      }
    };

    fetchMyInfo();
  }, [navigate, updateUser]);

  const openEdit = () => {
    setForm({ email: user?.email || "", dept: user?.dept || "" });
    setErr("");
    setEditOpen(true);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const isEmail = (val) => /\S+@\S+\.\S+/.test(val);

  const saveProfile = async () => {
  setErr("");

  if (!isEmail(form.email)) {
    setErr("이메일 형식이 올바르지 않습니다.");
    return;
  }
  if (!form.dept.trim()) {
    setErr("학과(전공)를 선택하세요.");
    return;
  }

  setSaving(true);
  try {
    // ✅ 백엔드 명세에 맞게 payload 구성 (키 이름은 명세대로!)
    const payload = {
      email: form.email.trim(),
      department: form.dept,
      // 계좌까지 수정이면 account_bank / account_num 같은 것도 여기에 추가
    };

    await updateMyInfoApi(payload);

    // ✅ 성공하면 프론트 상태도 갱신
    if (typeof updateUser === "function") {
      updateUser({ email: payload.email, dept: payload.department });
    }

    setEditOpen(false);
    alert("저장 완료");
  } catch (e) {
    console.error(e);
    setErr(e?.message || "저장 중 오류가 발생했습니다.");
  } finally {
    setSaving(false);
  }
};

  /* ---------------- 비밀번호 변경(모의 이메일 인증) ---------------- */
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sentMsg, setSentMsg] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const genCode = () => String(Math.floor(100000 + Math.random() * 900000));

  const sendCode = async () => {
    setSending(true);
    try {
      const code = genCode();
      const exp = Date.now() + 5 * 60 * 1000;
      localStorage.setItem(
        CODE_KEY,
        JSON.stringify({ code, exp, email: user?.email || "" })
      );
      setSentMsg(
        `인증번호를 ${user?.email || "등록된 이메일"}로 보냈습니다. (유효기간 5분)`
      );
      console.log("[DEV] password code:", code);
    } finally {
      setSending(false);
    }
  };

  const verifyCodeAndGo = async () => {
    setVerifying(true);
    try {
      const raw = localStorage.getItem(CODE_KEY);
      if (!raw) {
        alert("인증번호를 먼저 발송해 주세요.");
        return;
      }
      const { code, exp } = JSON.parse(raw);
      if (Date.now() > exp) {
        alert("인증번호가 만료되었습니다. 다시 발송해 주세요.");
        return;
      }
      if (String(codeInput).trim() !== String(code)) {
        alert("인증번호가 일치하지 않습니다.");
        return;
      }

      localStorage.removeItem(CODE_KEY);
      navigate("/mypage/password", { replace: true });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="MyPageWrap">
      <header className="MPHeader">
        <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          ←
        </button>
        <Link to="/" className="MPTitle MPBrandLink">
          SoomBrella
        </Link>
        <div style={{ width: 24 }} />
      </header>

      <section className="ProfileCard">
        <div className="Avatar" aria-hidden>👤</div>
        <div className="Who">
          <div className="Nick">
            {user?.name || "사용자"} {user?.username ? `(${user.username})` : ""}
          </div>
          <div className="Meta">{user?.dept || "전공 미입력"}</div>
        </div>
      </section>

      <nav className="Tabs">
        <button className="Tab active" type="button">계정 정보</button>
        <button className="Tab" type="button" onClick={() => navigate("/mypage/rents")}>
          대여 목록
        </button>
        <button className="Tab" type="button" onClick={() => navigate("/mypage/guide")}>
          이용 안내
        </button>
      </nav>

      <section className="Card">
        <label className="Label">아이디</label>
        <input className="Input" value={v(user?.username)} readOnly placeholder="-" />

        <label className="Label">이름</label>
        <input className="Input" value={v(user?.name)} readOnly placeholder="-" />

        <label className="Label">이메일</label>
        <input className="Input" value={v(user?.email)} readOnly placeholder="-" />

        <label className="Label">전공</label>
        <div className="SelectWrap">
          <select className="Select" value={v(user?.dept)} disabled>
            <option value={v(user?.dept)}>{v(user?.dept) || "-"}</option>
          </select>
          <span className="Chevron">▾</span>
        </div>

        {err && <small style={{ color: "#b91c1c" }}>{err}</small>}
      </section>

      <div className="Actions">
        <button className="Btn ghost" type="button" onClick={openEdit}>
          프로필 수정
        </button>
        <button
          className="Btn primary"
          type="button"
          onClick={() => {
            setSentMsg("");
            setCodeInput("");
            setPwModalOpen(true);
          }}
        >
          비밀번호 변경
        </button>
      </div>

      <SimpleModal
        open={editOpen}
        title="프로필 수정"
        onClose={() => !saving && setEditOpen(false)}
        onConfirm={saveProfile}
        confirmText={saving ? "저장 중..." : "저장"}
        disabled={saving}
      >
        <div className="Card" style={{ gap: 10 }}>
          <label className="Label" htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="email"
            className="Input"
            value={form.email}
            onChange={onChange}
            placeholder="example@school.ac.kr"
            autoComplete="email"
            disabled={saving}
          />

          <label className="Label" htmlFor="dept">학과(전공)</label>
          <div className="SelectWrap">
            <select
              id="dept"
              name="dept"
              className="Select"
              value={form.dept}
              onChange={onChange}
              disabled={saving}
            >
              <option value="">전공 선택</option>
              {MAJORS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <span className="Chevron">▾</span>
          </div>

          {err && <small style={{ color: "#b91c1c" }}>{err}</small>}
        </div>
      </SimpleModal>

      <SimpleModal
        open={pwModalOpen}
        title="비밀번호 변경"
        onClose={() => {
          setPwModalOpen(false);
          localStorage.removeItem(CODE_KEY);
        }}
        onConfirm={verifyCodeAndGo}
        confirmText={verifying ? "확인 중..." : "확인"}
        disabled={verifying}
      >
        <div className="Card" style={{ gap: 10 }}>
          <p className="Note" style={{ margin: 0 }}>
            등록된 이메일로 인증번호를 보내 드립니다.
          </p>

          <button type="button" className="Btn ghost" onClick={sendCode} disabled={sending}>
            {sending ? "발송 중..." : "인증번호 보내기"}
          </button>

          {sentMsg && <small style={{ color: "#0b2d57" }}>{sentMsg}</small>}

          <label className="Label" htmlFor="code">인증번호</label>
          <input
            id="code"
            className="Input"
            inputMode="numeric"
            maxLength={6}
            placeholder="6자리 숫자"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ""))}
          />

          <small className="Note" style={{ color: "#6b7280" }}>
            인증번호는 5분간 유효합니다.
          </small>
        </div>
      </SimpleModal>

      <BottomTab />
    </main>
  );}
