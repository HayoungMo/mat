import React from 'react';

const LoginPageInfo = ({name, onNext}) => {
    return (
        <div style={{textAlign:'center', padding: '20px 0'}}>
            <h2>...</h2>
            <p style={{marginTop:'30px'}}>
                <button 
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'instant' }); // ← 추가
                        onNext();
                    }}
                    className="btn-navy"
                >
                    로그인하러 가기
                </button>
            </p>
        </div>
    );
};

export default LoginPageInfo;
