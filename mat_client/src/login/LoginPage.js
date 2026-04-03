import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPageInfo from './LoginPageInfo';
import './loginpage.css';

const EMAIL_OPTION = [
    {value: 'none', label: '--- 선택 ---'},
    {value: '@naver.com', label:'@naver.com'},
    {value: '@gmail.com', label:'@gmail.com'},
    {value: '@daum.net', label:'@daum.net'},
    {value: '@nate.com', label:'@nate.com'},
    {value: '', label: '직접입력'},
]

const LoginPage = ({loginUser, setLoginUser, setLoginInfo}) => {
    const [step, setStep] = useState(3);
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({
        userId: '', password: '', telHead: '010', telMid:'', telTail:'',
        emailId: '', emailDomain:'none', addr: '', birthYear: '', birthMonth:'', birthDay:''
    });
    const [idCheck, setIdCheck] = useState({ msg: '', ok: null });
    const [idFormatMsg, setIdFormatMsg] = useState('');
    const [isDirectInput, setIsDirectInput] = useState(false);
    const [pwCheck, setPwCheck] = useState('');

    useEffect(() => {
        if (!loginUser && window.location.pathname.includes('/mypage')) {
            setStep(3);
        }
    }, [loginUser, location]);

    const { userId, password, emailId, emailDomain } = form;

    const onText = (evt) => {
        const { value, name } = evt.target;

        // 연락처 숫자만
        if ((name === 'telMid' || name === 'telTail') && isNaN(value)) {
            alert('숫자만 입력하세요'); return;
        }

        // 한글 금지
        if ((name === 'userId' || name === 'emailId') && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)) {
            alert('한글은 입력할 수 없습니다'); return;
        }

        // 아이디 특수기호 금지
        if (name === 'userId') {
            if (/[^a-zA-Z0-9_]/.test(value)) {
                setIdFormatMsg('영문, 숫자, 언더스코어(_)만 입력 가능합니다');
                return;
            }
            setIdFormatMsg('');
            setIdCheck({ msg: '', ok: null });
        }

        // 이메일 도메인 select 변경
        if (name === 'emailDomain' && evt.target.tagName === 'SELECT') {
            setIsDirectInput(value === '');
            if (value === '') {
                setForm({ ...form, emailDomain: '' });
                return;
            }
        }

        setForm({ ...form, [name]: value });
    };

    const onCheckId = async () => {
        if (!userId.trim()) { alert('아이디를 입력하세요'); return; }
        const res = await axios.get(`/api/check-id?userId=${userId}`);
        setIdCheck({ msg: res.data.message, ok: res.data.available });
    };

    const onNext = async () => {
        if (!idCheck.ok) { alert('아이디 중복확인을 해주세요'); return; }
        if (!userId.trim()) { alert('아이디를 입력해주세요'); return; }
        if (!password.trim()) { alert('비밀번호를 입력해주세요'); return; }
        if (password !== pwCheck) { alert('비밀번호가 일치하지 않습니다'); return; }
        if (!form.birthYear || !form.birthMonth || !form.birthDay) {
            alert('생년월일을 모두 선택해주세요'); return;
        }
        if (emailId && (!emailDomain || emailDomain === 'none')) {
            alert('이메일 도메인을 선택하거나 직접 입력해주세요'); return;
        }

        const tel = form.telHead + form.telMid + form.telTail;
        const birth = String(form.birthYear).slice(2) + form.birthMonth + form.birthDay;

        try {
            const email = (emailId && emailDomain && emailDomain !== 'none')
                ? emailId + emailDomain : '';
            const response = await axios.post('/api/register', {
                userId, password, tel, email, addr: form.addr, birth
            });
            if (response.data.success) setStep(2);
        } catch (error) {
            alert("이미 사용 중인 ID거나 저장에 실패하였습니다.");
        }
    };

    const onLogin = async () => {
        try {
            const response = await axios.post('/api/login', { userId, password });
            if (response.data.success) {
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setLoginUser(response.data.userId);
                setLoginInfo(response.data.user);
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate('/');
            } else {
                alert(response.data.message || "아이디 또는 비밀번호가 틀렸습니다");
            }
        } catch (error) { alert("로그인 중 서버 오류가 발생했습니다"); }
    };

    const onLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        setLoginUser(null);
        setLoginInfo(null);
        setForm({ userId: '', password: '', telHead: '010', telMid:'', telTail:'',
            emailId: '', emailDomain:'none', addr: '', birthYear: '', birthMonth:'', birthDay:'' });
        setPwCheck('');
        setStep(3);
        alert("로그아웃 되었습니다");
    };

    const year = Number(form.birthYear);
    const month = Number(form.birthMonth);
    const lastDay = (year && month) ? new Date(year, month, 0).getDate() : 31;

    const Trademark = () => (
        <div className="card-trademark-container">
            <div className="trademark-line"></div>
            <p className="card-trademark">POWERED BY <strong>EAT-LOG TEAM</strong> © 2026</p>
            <p className="card-tagline">BEYOND THE PLATE, INTO THE MEMORY</p>
        </div>
    );

    return (
        <main className="auth-main">
            {/* 회원가입 폼 */}
            {step === 1 && (
                <div className="card navy-top join-card">
                    <h3 className="card-title" style={{ flexDirection: 'column', gap: '4px' }}>
                        회원가입
                        <span className="title-en">SIGN UP</span>
                    </h3>
                    <div className="input-group">
                        {/* 아이디 */}
                        <p>
                            <label>아이디</label>
                            <div className="flex-row">
                                <input type='text' name='userId' value={userId} onChange={onText}
                                    placeholder="아이디 입력" className="auth-input" />
                                <button type="button" className="btn-check" onClick={onCheckId}>중복확인</button>
                            </div>
                            {idFormatMsg && <span className="check-fail">{idFormatMsg}</span>}
                            {idCheck.msg && (
                                <span className={idCheck.ok ? 'check-ok' : 'check-fail'}>{idCheck.msg}</span>
                            )}
                        </p>

                        {/* 비밀번호 */}
                        <p>
                            <label>비밀번호</label>
                            <input type='password' name='password' value={password} onChange={onText}
                                placeholder="비밀번호 입력" className="auth-input" />
                        </p>

                        {/* 비밀번호 확인 */}
                        <p>
                            <label>비밀번호 확인</label>
                            <input type='password' value={pwCheck}
                                onChange={(e) => setPwCheck(e.target.value)}
                                placeholder="비밀번호 재입력" className="auth-input" />
                            {pwCheck && (
                                <span className={password === pwCheck ? 'check-ok' : 'check-fail'}>
                                    {password === pwCheck ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                                </span>
                            )}
                        </p>

                        {/* 생년월일 */}
                        <p>
                            <label>생년월일</label>
                            <div className="flex-row">
                                <select name="birthYear" value={form.birthYear} onChange={onText} className="custom-select">
                                    <option value="">연도</option>
                                    {Array.from({ length: 80 }, (_, i) => 2007 - i).map(y =>
                                        <option key={y} value={y}>{y}년</option>)}
                                </select>
                                <select name="birthMonth" value={form.birthMonth} onChange={onText} className="custom-select">
                                    <option value="">월</option>
                                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m =>
                                        <option key={m} value={m}>{m}월</option>)}
                                </select>
                                <select name="birthDay" value={form.birthDay} onChange={onText} className="custom-select">
                                    <option value="">일</option>
                                    {Array.from({ length: lastDay }, (_, i) => String(i + 1).padStart(2, '0')).map(d =>
                                        <option key={d} value={d}>{d}일</option>)}
                                </select>
                            </div>
                        </p>

                        {/* 연락처 */}
                        <p>
                            <label>연락처(선택)</label>
                            <div className="flex-row">
                                <select name="telHead" value={form.telHead} onChange={onText} className="custom-select">
                                    <option value="010">010</option>
                                    <option value="011">011</option>
                                </select>
                                <input type="text" name="telMid" value={form.telMid} onChange={onText} maxLength={4} className="auth-input" />
                                <input type="text" name="telTail" value={form.telTail} onChange={onText} maxLength={4} className="auth-input" />
                            </div>
                        </p>

                        {/* 이메일 */}
                        <p>
                            <label>이메일(선택)</label>
                            <div className="flex-row">
                                <input type='text' name='emailId' value={emailId} onChange={onText}
                                    placeholder='이메일 주소' className="auth-input" />
                                <select name="emailDomain" value={form.emailDomain} onChange={onText} className="custom-select">
                                    {EMAIL_OPTION.map(opt => (
                                        <option key={opt.label} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            {isDirectInput && (
                                <input type='text' name='emailDomain' value={form.emailDomain} onChange={onText}
                                    placeholder="@example.com(직접입력)" className="auth-input" style={{ marginTop: '8px' }} />
                            )}
                        </p>
                    </div>

                    <button className="btn-navy" style={{ marginTop: '30px' }} onClick={onNext}>가입하기</button>
                    <button className="btn-gray" onClick={() => setStep(3)}>뒤로가기</button>
                    <Trademark />
                </div>
            )}

            {/* 로그인 폼 */}
            {step === 3 && (
                <div className="card navy-top">
                    <h3 className="card-title">로그인 <span className="title-en">LOGIN</span></h3>
                    <div className="input-group">
                        <p>
                            <label>아이디</label>
                            <input type='text' name='userId' value={userId} onChange={onText}
                                placeholder="아이디 입력" className="auth-input" />
                        </p>
                        <p>
                            <label>비밀번호</label>
                            <input type='password' name='password' value={password} onChange={onText}
                                placeholder="비밀번호 입력" className="auth-input" />
                        </p>
                    </div>
                    <button className="btn-navy" style={{ marginTop: '30px' }} onClick={onLogin}>로그인하기</button>
                    <p className="signup-link">
                        계정이 없으신가요?
                        <a href="#!" onClick={(e) => { e.preventDefault(); setStep(1); }}>회원가입</a>
                    </p>
                    <Trademark />
                </div>
            )}

            {/* 가입 완료 */}
            {step === 2 && (
                <div className="card navy-top">
                    <LoginPageInfo name={userId} onNext={() => setStep(3)} />
                    <Trademark />
                </div>
            )}
        </main>
    );
};

export default LoginPage;