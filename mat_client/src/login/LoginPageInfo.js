import React from 'react';

const LoginPageInfo = ({name, onNext}) => {
    return (
        <div style={{textAlign:'center',margin: '50px'}}>
            <h2>
                <span style={{color:'blue'}}>{name}</span>
                <br/>
                회원가입이 완료되었습니다!
            </h2>
            <p style={{marginTop:'20px'}}>
                <button onClick={() => window.location.href='/login'}
                 style={{padding:'10px 20px', cursor:'pointer'}}>
                    로그인
                 </button>
            </p>
        </div>
    );
};

export default LoginPageInfo;