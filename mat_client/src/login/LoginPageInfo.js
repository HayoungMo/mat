import React from 'react';

const LoginPageInfo = ({name}) => {
    return (
        <>
            <h2>
                <span>{name}님</span>
                회원가입이 완료되었습니다
            </h2>
        </>
    );
};

export default LoginPageInfo;