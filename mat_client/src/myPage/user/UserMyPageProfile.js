import React from 'react';

const UserMyPageProfile = ({profile,onEdit,changeInput,isEdit,loginUser}) => {
    if (!profile) return null
    const {password,tel,email,role} =profile

    if(role){

    }

    return (
        <div>
            <p>아이디: {loginUser}</p>
            <p>회원유형: { profile.role === 'user' ?'일반 회원' : 
                profile.role === 'city' ? '지역 회원' : 
                profile.role === 'admin' ? '관리자' : 
                profile.role}</p>
            {/* <button>등업신청</button> */}
            
            <p>비밀번호: </p>
            <input type='text' value={password ?? ''} name='password' onChange={changeInput} disabled={!isEdit}/>
            <p>전화번호: </p>
            <input type='text' value={tel ?? ''} name='tel' onChange={changeInput} disabled={!isEdit}/>
            <p>이메일: </p>
            <input type='text' value={email ?? ''} name='email' onChange={changeInput} disabled={!isEdit}/>
            {isEdit}
        </div>
    );
};

export default UserMyPageProfile;