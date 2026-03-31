import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginPageInfo from './LoginPageInfo';
import axios from 'axios';
import './loginpage.css';

const EMAIL_OPTION = [
    {value: '', label: '직접입력'},
    {value: '@naver.com', label:'@naver.com'},
    {value: '@gmail.com', label:'@gmail.com'},
    {value: '@daum.net', label:'@daum.net'},
    {value: '@nate.com', label:'@nate.com'},
]

const LoginPage = ({loginUser, setLoginUser, loginInfo, setLoginInfo}) => {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        userId: '', password: '', tel: '', email: '', addr: '', birth: ''
    });

    const { userId, password, tel, email, addr, birth } = form;

    const onText = (evt) => {
        const { value, name, tagName } = evt.target;
        let newValue = value;
        if (name === 'email' && tagName === 'SELECT') newValue = form.email + value;
        if (name === 'tel' && isNaN(value)) { alert('숫자만 입력하세요'); return; }
        if (name === 'birth' && value.length > 6) { alert('6자리만 입력하세요'); return; }
        setForm({ ...form, [name]: newValue });
    };

    const onNext = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/register', form);
            if (response.data.success) setStep(2);
        } catch (error) { alert("이미 사용 중인 ID이거나 저장에 실패했습니다"); }
    };

    const onLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/login', {
                userId, password 
            }, { withCredentials: true });

            if (response.data.success) {
                const savedId = response.data.userId; 
                const savedInfo = response.data.user;
                localStorage.setItem('userId', savedId);
                localStorage.setItem('user', JSON.stringify(savedInfo));
                setLoginUser(savedId);
                setLoginInfo(savedInfo);
                setStep(0); 
                alert(savedId + "님 환영합니다");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("로그인 서버 에러 발생");
        }
    };

    const onLogout = () => {
        setLoginUser(null);
        setLoginInfo(null);
        setForm({ userId: '', password: '', tel: '', email: '', addr: '', birth: '' });
        setStep(0);
        alert("로그아웃 되었습니다");
    };

    return (
        <div className='login-page-container'>
            {/* 상단 헤더: 우측 메뉴 화이트 배치 */}
            <header className="auth-header">
                <div className="header-inner">
                    <Link to="/" className="logo-box">
                        <span className="logo-text">MAT-ZIP</span>
                    </Link>
                    <div className="header-right">
                        <span onClick={() => setStep(3)}>로그인</span>
                        <span className="bar">|</span>
                        <span onClick={() => alert('준비 중입니다.')}>고객센터</span>
                    </div>
                </div>
            </header>

            {/* 중앙 메인: 유리창 효과 카드 */}
            <main className="auth-main">
                {step === 0 && (
                    <div className="card navy-top">
                        <h2>{loginUser ? `${loginUser}님 환영합니다!` : "서비스를 선택해주세요."}</h2>
                        <div className="btn-group">
                            {!loginUser && <button className="btn-wine" onClick={() => setStep(1)}>회원가입</button>}
                            <button className={loginUser ? "btn-logout" : "btn-navy"} onClick={loginUser ? onLogout : () => setStep(3)}>
                                {loginUser ? "로그아웃" : "로그인"}
                            </button>
                        </div>
                    </div>
                )}
                
                {step === 1 && (
                    <div className="card navy-top join-card">
                        <h3>회원가입</h3>
                        <div className="input-group">
                            <p><label>ID</label><input type='text' value={userId} name='userId' onChange={onText}/></p>
                            <p><label>비밀번호</label><input type='password' value={password} name='password' onChange={onText}/></p>
                            <p><label>전화번호</label><input type='text' value={tel} name='tel' onChange={onText}/></p>
                            <p>
                                <label>이메일</label>
                                <div className="email-flex">
                                    <input type='text' value={email} name='email' onChange={onText}/>
                                    <select name="email" onChange={onText}>
                                        {EMAIL_OPTION.map((item, index) => <option key={index} value={item.value}>{item.label}</option>)}
                                    </select>
                                </div>
                            </p>
                            <p><label>주소</label><input type='text' value={addr} name='addr' onChange={onText}/></p>
                            <p><label>생년월일</label><input type='text' value={birth} name='birth' onChange={onText} placeholder="6자리"/></p>
                        </div>
                        <div className="btn-group-column">
                            <button className="btn-navy" onClick={onNext}>가입완료</button>
                            <button className="btn-gray" onClick={() => setStep(0)}>취소</button>
                        </div>
                    </div>
                )}

                {step === 2 && <div className="card navy-top"><LoginPageInfo name={userId} /></div>}

                {step === 3 && (
                    <div className="card navy-top">
                        <h3>로그인</h3>
                        <div className="input-group">
                            <p><label>ID</label><input type='text' name='userId' value={userId} onChange={onText}/></p>
                            <p><label>PW</label><input type='password' name='password' value={password} onChange={onText}/></p>
                        </div>
                        <div className="btn-group-column">
                            <button className="btn-navy" onClick={onLogin}>로그인하기</button>
                            <button className="btn-gray" onClick={() => setStep(0)}>뒤로가기</button>
                        </div>
                    </div>
                )}
            </main>

            {/* 하단 푸터: 위로 퍼지는 볼륨 효과 */}
            <footer className="auth-footer">
                <div className="footer-inner">
                    <p>(주)인호네맛집플랫폼 | 대표자: 인호 | 서울특별시 맛집구 미식동 123</p>
                    <p>고객센터: 02-1234-5678 | 이메일: support@matzip.com</p>
                    <p className="copy">© 2024 MATZIP. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
