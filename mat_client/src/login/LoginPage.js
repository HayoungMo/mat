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


//수정한 부분(세션관련)
const LoginPage = ({loginUser,setLoginUser,loginInfo, setLoginInfo}) => {
    const [step, setStep] = useState(0);
    //const [loginUser, setLoginUser] = useState(localStorage.getItem('userId'));
    const [form, setForm] = useState({
        userId: '', password: '', telHead: '010', telMid:'', telTail:'', emailId: '',emailDomain:'' , addr: '', birthYear: '',
        birthMonth:'',birthDay:''
    });

    
    //중첩이유 onText에서 select일때 form.email + value로 계속 이어 붙어서 input 두개로 분리하는것이다. 그래서 위에 form state에서 emailId와 emailDomain을 나눠야한다.
    // const onText = (evt) => {
        //     const { value, name, tagName } = evt.target;
        //     let newValue = value;
        //그래서 여기서 관련 분기를 지우고 
        // if (name === 'email' && tagName === 'SELECT') {
            //     newValue = form.email + value;
            // }
const { userId, password, tel, emailId, emailDomain, addr, birth } = form;
            
    const onText = (evt) => {
        const { value, name } = evt.target;
        let newValue = value;

        if((name === 'telMid' || name === 'telTail') && isNaN(value)){
            alert('숫자만 입력하세요');
            return;
        }
        if (name === 'tel' && isNaN(value)) {
            alert('숫자만 입력하세요');
            return;
        }

        if (name === 'birth' && value.length > 6) {
            alert('6자리만 입력하세요');
            return;
        }

        //이메일 한글 차단
        if((name === 'emailId' || name === 'email') && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)){
            alert('이메일에 한글은 입력할 수 없습니다');
            return;
        }

        setForm({
            ...form,
            [name]: newValue
        });
    };

    const onNext = async () => {

        const birth = form.birthYear ?
        String(form.birthYear).slice(2) + form.birthMonth + form.birthDay : '';
        //필수항목 검사(email, addr은 선택이라 제외)
        if(!userId.trim()) {alert('아이디를 입력해주세요'); document.querySelector('[name=userId]').focus(); return}
        if(!password.trim()) {alert('비밀번호를 입력해주세요'); document.querySelector('[name=password]').focus(); return}
        if(!tel.trim()) {alert('전화번호를 입력해주세요'); document.querySelector('[name=tel]').focus(); return}
        if(!birth.trim()) {alert('생년월일을 입력해주세요'); document.querySelector('[name=birth]').focus(); return}
        
        try{
            //이메일 합쳐서 전송(비어있으면 빈문자열)
            // const sendData ={
            //     ...form,
            //     email: form.emailId + form.emailDomain 
            // };
            // delete sendData.emailId;
            // delete sendData.emailDomain;

            const domain = emailDomain || (form.emailCustomDomain ? '@' + form.emailCustomDomain : '');
            const email = emailId ? emailId + emailDomain : '';
            const {emailId: _eid, emailDomain: _edom, ...rest} = form;
            const response = await axios.post('/api/register', { ...rest, email });
            if(response.data.success) {
                setStep(2); //가입 완료  페이지
            }
        }catch (error) {
            console.error("회원가입 에러",error);
            alert("이미 사용 중인 ID거나 저장에 실패하였습니다.")
        }
    };

    //선택된 연도와 월을 숫자로 변환한다.
    const year = Number(form.birthYear);
    const month = Number(form.birthMonth);

    //연도와 월이 모두 선택되면 해당 달의 마지막 날을 구하고 아니면 31을 기본으로 사용한다
    const lastDay = (year && month) ? new Date(year, month, 0).getDate() : 31;
    
    // const onNext = async () => {
    //     try {
    //         const response = await axios.post('/api/register', form);
    //         if (response.data.success) {
    //             setStep(2); // 가입 완료 페이지로
    //         }
    //     } catch (error) {
    //         console.error("회원가입 에러", error);
    //         alert("이미 사용 중인 ID이거나 저장에 실패했습니다");
    //     }
    // };

    //수정한부분(세션관련)
    const onLogin = async () => {
        try {
            const response = await axios.post('/api/login', {
                userId,
                password
            },{withCredentials:true})

            if (response.data.success) {
                localStorage.setItem('userId',response.data.userId)
                localStorage.setItem('user',JSON.stringify(response.data.user))
                setLoginUser(response.data.userId);
                setLoginInfo(response.data.user);
                setStep(0); 
                alert(response.data.userId + "님 환영합니다");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            //console.log(error.response) //서버가 보내는 오류
            //console.log(error.message) //에러 메세지
            alert("로그인 중 서버 오류가 발생했습니다");
        }
    };

    //수정한부분(세션관련)
    const onLogout = () => {
        localStorage.removeItem('userId')
        setLoginUser(null);
        onReset();
        setStep(0);
        alert("로그아웃 되었습니다");
    };

    const onReset = () => {
        setForm({
            userId: '', password: '', tel: '', emailId: '',emailDomain:'', addr: '', birthYear: '', birthMonth: '', birthDay: ''
        });
        setStep(0);
    };

    //로그인 안했으면 로그인 페이지로 보내기 기능
    const checkLoginAndAction = (action) => {
        if(!loginUser){
            alert("로그인이 필요한 서비스입니다.")
            setStep(3)
            return
        }
        action()
    }

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
                    
                    <p><label>생년월일(6자리)</label>
                    <select name="birthYear" value={form.birthYear} onChange={onText}>
                        <option value="">년도</option>
                        {Array.from({length: 80}, (_,i) => 2007 - i).map(y => (
                            <option key={y} value={y}>{y}년</option>
                        ))}
                    </select>
                    <select name="birthMonth" value={form.birthMonth} onChange={onText}>
                        <option value="">월</option>
                        {Array.from({length: 12}, (_,i) => i + 1).map(m => (
                            <option key={m} value={String(m).padStart(2,'0')}>{m}월</option>
                        ))}
                    </select>
                    <select name="birthDay" value={form.birthDay} onChange={onText}>
                        <option value="">일</option>
                        {Array.from({length: lastDay}, (_,i) => i + 1).map(d => (
                            <option key={d} value={String(d).padStart(2,'0')}>{d}일</option>
                        ))}
                    </select>
                    </p>
                    
                    <p><label>비밀번호</label><input type='password' value={password} name='password' onChange={onText}/></p>
                    
                    <p><label>전화번호</label>
                    <select name="telHead" value={form.telHead} onChange={onText}>
                        <option value="010">010</option>
                        <option value="011">011</option>
                        <option value="02">02</option>
                        <option value="031">031</option>
                    </select>
                    -
                    <input type='text' value={form.telMid} name='telMid' onChange={onText} maxLength={4} 
                    placeholder='0000' style={{width:'60px'}}/>
                    -
                    <input type='text' value={form.telTail} name='telTail' onChange={onText} maxLength={4} 
                    placeholder='0000' style={{width:'60px'}}/>
                    </p>
                    <p>
                        <label>이메일(선택)</label>
                        <input type='text' value={form.emailId} name='emailId' onChange={onText}
                            placeholder='example' style={{width:'120'}}/>
                            @
                            {form.emailDomain === '' ? (
                                <input type='text' name='emailCustomDomain' value={form.emailCustomDomain || ''}
                                onChange={onText} placeholder='직접입력' style={{width:'120px'}}/>
                            ) : (
                                <span style={{display:'inline-block', width:'120px', padding:'4px'}}>{form.emailDomain.replace('@','')}</span>
                            )}
                        <select name="emailDomain" value={form.emailDomain} onChange={onText}>
                            {EMAIL_OPTION.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                        </select>

                        {/* <input type='text' value={form.emailId} name='emailId' onChange={onText} placeholder='example'/>
                        <select name="emailDomain" value={form.emailDomain} onChange={onText}>
                            {EMAIL_OPTION.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                        </select> */}
                        {/* 입력 결과 미리보기 */}
                        {/* {emailId && <span style={{marginLeft:'8px', color:'#666'}}>{emailId}{emailDomain}</span>} */}
                    </p>
                    <p><label>주소(선택)</label><input type='text' value={addr} name='addr' onChange={onText}/></p>
                    <p>
                        <button onClick={onNext}>가입완료</button>
                        <button onClick={onReset}>취소</button>
                    </p>
                    <p style={{marginTop:'10px',textAlign:'center'}}>
                        이미 계정이 있으신가요?
                        <span onClick={() => {onReset(); setStep(3);}}
                        style={{color:'blue', cursor:'pointer', textDecoration:'underline', marginLeft:'5px'}}>
                            로그인 하기
                        </span>
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
