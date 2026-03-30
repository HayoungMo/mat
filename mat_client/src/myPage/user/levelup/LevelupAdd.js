import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LevelupAdd = ({loginUser}) => {

    const navigate = useNavigate()

    useEffect(()=>{
        if(loginUser){
            setForm(prev=>({
                ...prev,
                userId: loginUser
            }))
        }
    },[loginUser])

    const [form,setForm] = useState({
        userId: loginUser,
        cityName: '',
        reason:''
    })

    const changeInput =(evt)=>{
        const {value,name} = evt.target
        setForm({
            ...form,
            [name] : value
        })
    }

    const onSubmit= async()=>{
        
        if(!form.cityName){
            alert('지역을 선택하라!')
            return
        }

        if(!form.reason){
            alert('신청 사유 입력!')
            return
        }

        await fetch('/api/upgrade',{
            method:'DELETE',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({userId: loginUser})
        })
        
        await fetch('/api/upgrade',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })

        alert('신청 완료!')

        navigate('/mypage/',{ state : {refresh:true}})
    }

    return (
        <div>
            <p>
                <label>아이디</label>
                <span>{loginUser}</span>
            </p>
            <p>
                <label>지역</label>
                <input type='radio' name='cityName' value="Gangnam" checked={form.cityName === 'Gangnam'} onChange={changeInput}/>강남구
                <input type='radio' name='cityName' value="Yongsan" checked={form.cityName === 'Yongsan'} onChange={changeInput}/>용산구
                <input type='radio' name='cityName' value="Dongjak" checked={form.cityName === 'Dongjak'} onChange={changeInput}/>동작구
                <input type='radio' name='cityName' value="Mapo" checked={form.cityName === 'Mapo'} onChange={changeInput}/>마포구
                <input type='radio' name='cityName' value="Jung" checked={form.cityName === 'Jung'} onChange={changeInput}/>중구
            </p>
            <p>
                <label>신청 사유</label>
                <input name='reason' value={form.reason} onChange={changeInput}/>
            </p>

            <p>
                <button onClick={onSubmit}>신청</button>
                <button type='button' onClick={()=>navigate('/mypage')}>취소</button>
            </p>
        </div>
    );
};

export default LevelupAdd;