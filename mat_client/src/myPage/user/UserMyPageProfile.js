import React from 'react';

const UserMyPageProfile = ({profile,onEdit,changeInput,isEdit}) => {
    if (!profile) return null
    const {userId,tel,email} =profile

    return (
        <tr>
            <td>아이디: {userId}</td>
            <td>전화번호: </td>
            <input type='text' value={tel} name='tel' onChange={changeInput} disabled={!isEdit}/>
            <td>이메일: </td>
            <input type='text' value={email} name='email' onChange={changeInput} disabled={!isEdit}/>
            {isEdit}
        </tr>
    );
};

export default UserMyPageProfile;