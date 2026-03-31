import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LoginPageInfo from './LoginPageInfo';
import './loginpage.css';

const EMAIL_OPTION = [
    {value: '', label: '직접입력'},
    {value: '@naver.com', label:'@naver.com'},
    {value: '@gmail.com', label:'@gmail.com'},
    {value: '@daum.net', label:'@daum.net'},
    {value: '@nate.com', label:'@nate.com'},
]

const LoginPage = ({loginUser, setLoginUser, setLoginInfo}) => {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        userId: '', password: '', telHead: '010', telMid:'', telTail:'', 
        emailId: '', emailDomain:'' , addr: '', birthYear: '', birthMonth:'', birthDay:''
    });

    const { userId, password, emailId, emailDomain } = form;

    const onText = (evt) => {
        const { value, name } = evt.target;
        if((name === 'telMid' || name === 'telTail') && isNaN(value)){
            alert('숫자만 입력하세요'); return;
        }
        if((name === 'userId' || name === 'emailId') && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)){
            alert('아이디에 한글은 입력할 수 없습니다'); return;
        }
        setForm({ ...form, [name]: value });
    };

    const onNext = async () => {
        const tel = form.telHead + form.telMid + form.telTail;
        const birth = form.birthYear ? String(form.birthYear).slice(2) + form.birthMonth + form.birthDay : '';
        if(!userId.trim()) { alert('아이디를 입력해주세요'); return }
        if(!password.trim()) { alert('비밀번호를 입력해주세요'); return }
        try {
            const email = emailId ? emailId + emailDomain : '';
            const response = await axios.post('/api/register', { userId, password, tel, email, addr: form.addr, birth });
            if(response.data.success) setStep(2);
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
                alert(`${response.data.userId}님, 환영합니다!`);
                setStep(0); 
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
        setForm({ userId: '', password: '', telHead: '010', telMid:'', telTail:'', emailId: '', emailDomain:'' , addr: '', birthYear: '', birthMonth:'', birthDay:'' });
        setStep(0);
        alert("로그아웃 되었습니다");
    };

    const year = Number(form.birthYear);
    const month = Number(form.birthMonth);
    const lastDay = (year && month) ? new Date(year, month, 0).getDate() : 31;

    const Trademark = () => (
        <div className="card-trademark-container">
            <div className="trademark-line"></div>
            <p className="card-trademark">PROUDLY POWERED BY <strong>VALORANTIS SYSTEMS</strong> © 2024</p>
            <p className="card-tagline">INNOVATION BEYOND BOUNDARIES</p>
        </div>
    );

    return (
        <div className='login-page-container'>
            <header className="auth-header">
                <div className="header-inner">
                    <Link to="/" className="logo-text">MAT</Link>
                    <div className="header-right">
                        {loginUser ? (
                            <>
                                <span>{loginUser}님</span>
                                <span className="bar">|</span>
                                <span onClick={onLogout} style={{cursor:'pointer'}}>로그아웃</span>
                            </>
                        ) : (
                            <>
                                <span onClick={() => setStep(3)} style={{cursor:'pointer'}}>로그인</span>
                                <span className="bar">|</span>
                                <span onClick={() => setStep(1)} style={{cursor:'pointer'}}>회원가입</span>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="auth-main">
                {step === 0 && (
                    <div className="card navy-top">
                        <h2 className="card-title">
                            {loginUser ? `${loginUser}님 환영합니다!` : "서비스 선택"}
                            {!loginUser && <span className="title-en">SELECT SERVICE</span>}
                        </h2>
                        <div style={{marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            {loginUser ? (
                                // 💡 로그인 된 경우: 로그아웃 버튼 노출
                                <button className="btn-wine" onClick={onLogout}>로그아웃</button>
                            ) : (
                                // 💡 로그인 안 된 경우: 로그인/회원가입 버튼 노출
                                <>
                                    <button className="btn-navy" onClick={() => setStep(3)}>로그인</button>
                                    <button className="btn-wine" onClick={() => setStep(1)}>회원가입</button>
                                </>
                            )}
                        </div>
                        <Trademark />
                    </div>
                )}

                {step === 1 && (
                    <div className="card navy-top join-card">
                        <h3 className="card-title">회원가입 <span className="title-en">SIGN UP</span></h3>
                        <div className="input-group">
                            <p><label>ID</label> <input type='text' name='userId' value={userId} onChange={onText} placeholder="아이디 입력"/></p>
                            <p><label>PW</label> <input type='password' name='password' value={password} onChange={onText} placeholder="비밀번호 입력"/></p>
                            <p><label>연락처</label>
                                <div className="flex-row">
                                    <select name="telHead" value={form.telHead} onChange={onText} className="custom-select"><option value="010">010</option><option value="011">011</option></select>
                                    <input type="text" name="telMid" onChange={onText} maxLength={4} style={{flex:1.5}}/>
                                    <input type="text" name="telTail" onChange={onText} maxLength={4} style={{flex:1.5}}/>
                                </div>
                            </p>
                            <p><label>생년월일</label>
                                <div className="flex-row">
                                    <select name="birthYear" onChange={onText} className="custom-select" style={{flex:1.5}}><option value="">연도</option>{Array.from({length: 80}, (_,i) => 2007 - i).map(y => <option key={y} value={y}>{y}년</option>)}</select>
                                    <select name="birthMonth" onChange={onText} className="custom-select" style={{flex:1}}><option value="">월</option>{Array.from({length: 12}, (_,i) => String(i+1).padStart(2,'0')).map(m => <option key={m} value={m}>{m}월</option>)}</select>
                                    <select name="birthDay" onChange={onText} className="custom-select" style={{flex:1}}><option value="">일</option>{Array.from({length: lastDay}, (_,i) => String(i+1).padStart(2,'0')).map(d => <option key={d} value={d}>{d}일</option>)}</select>
                                </div>
                            </p>
                        </div>
                        <button className="btn-navy" style={{marginTop:'30px'}} onClick={onNext}>가입하기</button>
                        <button className="btn-gray" onClick={() => setStep(0)}>뒤로가기</button>
                        <Trademark />
                    </div>
                )}

                {step === 2 && (
                    <div className="card navy-top">
                        <LoginPageInfo name={userId} onNext={() => setStep(3)} />
                        <Trademark />
                    </div>
                )}

                {step === 3 && (
                    <div className="card navy-top">
                        <h3 className="card-title">로그인 <span className="title-en">LOGIN</span></h3>
                        <div className="input-group">
                            <input type="text" name="userId" placeholder="아이디" onChange={onText} style={{marginBottom:'15px'}}/>
                            <input type="password" name="password" placeholder="비밀번호" onChange={onText} />
                        </div>
                        <button className="btn-navy" style={{marginTop:'25px'}} onClick={onLogin}>로그인</button>
                        <button className="btn-gray" onClick={() => setStep(0)}>뒤로가기</button>
                        <Trademark />
                    </div>
                )}
            </main>

            <footer className="auth-footer">
                <div className="footer-line"></div>
                <div className="footer-inner">
                    <div className="footer-info">
                        <span className="corp-name">(주) 발로란티스 시스템즈</span><span className="footer-bar">|</span>
                        <span>대표이사 : 홍길동</span><span className="footer-bar">|</span>
                        <span>사업자등록번호 : 123-45-67890</span>
                    </div>
                    <div className="footer-address"><span>서울특별시 강남구 테헤란로 123 발로란티스 타워 15층</span></div>
                    <div className="footer-contact">
                        <span>고객센터 : </span><span className="cs-number">1588-1234</span><span className="footer-bar">|</span>
                        <span>이메일 : support@valorantis.com</span>
                    </div>
                    <p className="copy">© 2024 VALORANTIS SYSTEMS Inc. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
