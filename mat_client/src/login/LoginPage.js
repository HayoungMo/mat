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

    const [step,setStep] = useState(1)

    const [form,setForm] = useState({
        userId:'',password:'',tel:'',email:'',addr:'',birth:''
    })


    const {userId,password,tel,email,addr,birth} = form

    const onText = (evt) => {
        
        const {value,name} = evt.target
        setForm({
            ...form,
            [name]:value
        })

       if(name === 'tel') {
        if(!isNaN(value)) {
            setForm({
                ...form,[name]:value});
            }else {
                alert('숫자만 입력하세요');
                return
            }
        }

        if(name === 'birth') {
            if(value.length > 6) {
                alert('6자리만 입력하세요')
                return
            }
        }

        setForm({
            ...form,
            [name]:value
        })
    }
    

    const onNext = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/register',form)

            if(response.data.success) {
                setStep(state => state + 1)
            }
        }catch (error) {
            console.error("회원가입 에러",error)
            alert("이미 사용 중인 ID이거나 저장에 실패했습니다")
        }
        
    }

    //const onPrev = () => {
    //    setStep(state => state - 1)
    //}

    const onReset = () => {
        setForm({
            userId:'',password:'',tel:'',email:'',addr:'',birth:''
        })
    }

    return (
        <div className='wrap'>

        {step === 1 && (
            <>
            <p>
                <label>ID</label>
                <input type='text' value={userId} name='userId' onChange={onText}/>
            </p>
            <p>
                <label>비밀번호</label>
                <input type='text' value={password} name='password' onChange={onText}/>
            </p>
            <p>
                <label>전화번호</label>
                <input type='text' value={tel} name='tel' onChange={onText}/>
            </p>
            <p>
                <label>이메일</label>
                <input type='text' value={email} name='email' onChange={onText}/>
                <select name="email" onChange={onText}>
                    {EMAIL_OPTION.map((item, index) =>(
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </p>
            <p>
                <label>주소</label>
                <input type='text' value={addr} name='addr' onChange={onText}/>
            </p>
            <p>
                <label>생년월일 앞 6자리</label>
                <input type='text' value={birth} name='birth' onChange={onText}/>
            </p>
            <p>
               <button onClick={onNext}>회원가입</button>
               <button onClick={onReset}>취소</button>
            </p>
            </>

            )}

            {
                step === 2 && 
                <LoginPageInfo name={userId} password={password} addr={addr}
                 tel={tel} email={email} birth={birth} onText={onText} onNext={onNext}/>
            }

        </div>
        
        

    );
};


    /*
    return (
        <div>

            {
                step === 1 && 
                <SurveyStep1 name={name} age={age} addr={addr} tel={tel} onText=
                {onText} onNext={onNext}/>
            }

            
            {step===2 &&
            <SurveyStep2 job={job} email={email} hobby={hobby}
            onNext={onNext} onPrev={onPrev} onText={onText}/>}
            {step===3 && <SurveyStep3 form={form} onNext={onNext} onPrev=
            {onPrev}/>}
            {step===4 && <SurveyStep4 name={name}/>}

        </div>
        */
    


export default LoginPage;