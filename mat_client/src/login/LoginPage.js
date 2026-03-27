import React, { useState } from 'react';
import LoginPageInfo from './LoginPageInfo';
import axios from 'axios';

const EMAIL_OPTION = [
    {value: '', label: '직접입력'},
    {value: '@naver.com', label:'@naver.com'},
    {value: '@gmail.com', label:'@gmail.com'},
    {value: '@daum.net', label:'@daum.net'},
    {value: '@nate.com', label:'@nate.com'},
]

const LoginPage = () => {
    const [step, setStep] = useState(0);
    const [loginUser, setLoginUser] = useState(null);
    const [form, setForm] = useState({
        userId: '', password: '', tel: '', email: '', addr: '', birth: ''
    });

    const { userId, password, tel, email, addr, birth } = form;

    const onText = (evt) => {
        const { value, name, tagName } = evt.target;
        let newValue = value;

        if (name === 'email' && tagName === 'SELECT') {
            newValue = form.email + value;
        }

        if (name === 'tel' && isNaN(value)) {
            alert('숫자만 입력하세요');
            return;
        }

        if (name === 'birth' && value.length > 6) {
            alert('6자리만 입력하세요');
            return;
        }

        setForm({
            ...form,
            [name]: newValue
        });
    };

    const onNext = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/register', form);
            if (response.data.success) {
                setStep(2); // 가입 완료 페이지로
            }
        } catch (error) {
            console.error("회원가입 에러", error);
            alert("이미 사용 중인 ID이거나 저장에 실패했습니다");
        }
    };

    const onLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/login', {
                userId,
                password
            });

            if (response.data.success) {
                alert(response.data.userId + "님 환영합니다");
                setLoginUser(response.data.userId);
                setStep(0); 
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error.response) //서버가 보내는 오류
            console.log(error.message) //에러 메세지
            alert("로그인 중 서버 오류가 발생했습니다");
        }
    };

    const onLogout = () => {
        setLoginUser(null);
        onReset();
        setStep(0);
        alert("로그아웃 되었습니다");
    };

    const onReset = () => {
        setForm({
            userId: '', password: '', tel: '', email: '', addr: '', birth: ''
        });
        setStep(0);
    };

    return (
        <div className='wrap'>
            
            {step === 0 && (
                <div className="menu-box">
                    <h2>{loginUser ? `${loginUser}님 환영합니다!` : "서비스를 선택해주세요."}</h2>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                        {!loginUser && (
                            <button onClick={() => setStep(1)} style={{ padding: '10px 20px' }}>회원가입</button>
                        )}
                        {loginUser ? (
                            <button onClick={onLogout} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white' }}>로그아웃</button>
                        ) : (
                            <button onClick={() => setStep(3)} style={{ padding: '10px 20px' }}>로그인</button>
                        )}
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="join-box">
                    <h3>회원가입</h3>
                    <p><label>ID</label><input type='text' value={userId} name='userId' onChange={onText}/></p>
                    <p><label>비밀번호</label><input type='password' value={password} name='password' onChange={onText}/></p>
                    <p><label>전화번호</label><input type='text' value={tel} name='tel' onChange={onText}/></p>
                    <p>
                        <label>이메일</label>
                        <input type='text' value={email} name='email' onChange={onText}/>
                        <select name="email" onChange={onText}>
                            {EMAIL_OPTION.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </p>
                    <p><label>주소</label><input type='text' value={addr} name='addr' onChange={onText}/></p>
                    <p><label>생년월일(6자리)</label><input type='text' value={birth} name='birth' onChange={onText}/></p>
                    <p>
                        <button onClick={onNext}>가입완료</button>
                        <button onClick={onReset}>취소</button>
                    </p>
                </div>
            )}

            {step === 2 && <LoginPageInfo name={userId} />}

            {step === 3 && (
                <div className="login-box">
                    <h3>로그인</h3>
                    <p><label>ID</label><input type='text' name='userId' value={userId} onChange={onText}/></p>
                    <p><label>PW</label><input type='password' name='password' value={password} onChange={onText}/></p>
                    <button onClick={onLogin}>로그인하기</button>
                    <button onClick={() => setStep(0)}>뒤로가기</button>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
