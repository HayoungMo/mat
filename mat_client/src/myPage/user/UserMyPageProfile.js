import React from 'react';

const UserMyPageProfile = ({profile,onEdit,changeInput,isEdit,loginUser}) => {
    if (!profile) return null
    const {userId,tel,email} =profile

    return (
        <div>
            <p>아이디: {loginUser.userId}</p>
            <p>전화번호: </p>
            <input type='text' value={tel ?? ''} name='tel' onChange={changeInput} disabled={!isEdit}/>
            <p>이메일: </p>
            <input type='text' value={email ?? ''} name='email' onChange={changeInput} disabled={!isEdit}/>
            {isEdit}
        </div>
    );
};

export default UserMyPageProfile;