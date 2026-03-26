import React from 'react';

const UserMyPageProfile = ({profile}) => {
    if (!profile) return null
    const {userId,tel,email} =profile


    return (
        <tr>
            <td>아이디: {userId}</td>
            <td>전화번호: {tel}</td>
            <td>이메일: {email}</td>
        </tr>
    );
};

export default UserMyPageProfile;