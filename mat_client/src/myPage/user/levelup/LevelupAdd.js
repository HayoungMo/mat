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
            alert('지역을 선택해주세요.')
            return
        }

        if(!form.reason){
            alert('신청 사유를 입력해주세요.')
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

        alert('신청이 완료되었습니다! 등업까지 하루~이틀까지의 시일이 소요될 수 있습니다.')

        navigate('/mypage/',{ state : {refresh:true}})
    }

    return (
        <section className="section-card">
            <h2 className="section-title">등업 신청</h2>
            
            <div style={{ padding: '20px 10px' }}>
                {/* 1. 아이디 (수정 불가 느낌으로 회색 배경 처리) */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <label style={{ width: '100px', fontWeight: 'bold', color: '#333' }}>아이디</label>
                    <span style={{ padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '4px', flex: 1, color: '#475569', border: '1px solid #e2e8f0' }}>
                        {loginUser}
                    </span>
                </div>

                {/* 2. 지역 선택 (라디오 버튼들을 가로로 예쁘게 정렬) */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <label style={{ width: '100px', fontWeight: 'bold', color: '#333' }}>지역</label>
                    <div style={{ flex: 1, display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input type='radio' name='cityName' value="Gangnam" checked={form.cityName === 'Gangnam'} onChange={changeInput}/> 강남구
                        </label>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input type='radio' name='cityName' value="Yongsan" checked={form.cityName === 'Yongsan'} onChange={changeInput}/> 용산구
                        </label>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input type='radio' name='cityName' value="Dongjak" checked={form.cityName === 'Dongjak'} onChange={changeInput}/> 동작구
                        </label>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input type='radio' name='cityName' value="Mapo" checked={form.cityName === 'Mapo'} onChange={changeInput}/> 마포구
                        </label>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input type='radio' name='cityName' value="Jung" checked={form.cityName === 'Jung'} onChange={changeInput}/> 중구
                        </label>
                    </div>
                </div>

                {/* 3. 신청 사유 (넓은 텍스트 영역으로 변경) */}
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <label style={{ width: '100px', fontWeight: 'bold', color: '#333', marginTop: '10px' }}>신청 사유</label>
                    <textarea 
                        name='reason' 
                        value={form.reason} 
                        onChange={changeInput}
                        placeholder="어떤 지역 맛집을 소개하고 싶으신가요?"
                        style={{ flex: 1, padding: '15px', border: '1px solid #cbd5e1', borderRadius: '4px', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit', outlineColor: '#8a2130' }}
                    />
                </div>

                {/* 4. 분리된 묵직한 버튼들! */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <button className="btn btn-primary" onClick={onSubmit}>신청</button>
                    <button className="btn btn-outline" type='button' onClick={()=>navigate('/mypage')}>취소</button>
                </div>
            </div>
        </section>
    );
};

export default LevelupAdd;