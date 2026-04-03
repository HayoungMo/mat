import React from 'react';

const LoginPageInfo = ({name, onNext}) => {
    return (
        <div style={{textAlign:'center', padding: '20px 0'}}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#222', lineHeight: '1.5' }}>
                <span style={{color:'#00aaff'}}>{name}</span>님,
                <br/>
                회원가입이 완료되었습니다!
            </h2>
            <p style={{marginTop:'30px'}}>
                <button
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'instant' });
                        onNext();
                    }}
                    className="btn-navy"
                    style={{ cursor:'pointer' }}
                >
                    로그인하러 가기
                </button>
            </p>
        </div>
    );
};

export default LoginPageInfo;