import React from 'react';

const Footer = () => {
    return (
        <footer className="auth-footer">
            <div className="footer-inner">
                <div className="footer-info">
                    <span className="corp-name">MAT </span>
                    <span className="footer-bar">|</span>
                    <span>Eat=Log</span>
                    <span className="footer-bar">|</span>
                </div>
                <div className="footer-address">
                    <span>경기도 수원시 팔달구 중부대로 104
                         휴먼교육센터 수원교육센터
                    </span>
                </div>
                <div className="footer-contact">
                    <a href="https://open.kakao.com/o/sDZGgOni" target="_blank" rel="noreferrer" className="cs-number cs-link">
                    카카오 문의하기
                    </a>
                    <span className="footer-bar">|</span>
                    <span>이메일: mohayoung80@gmail.com</span>
                </div>
                <p className="copy">© 2026 Eat=Log. Curating Local Tastes. All rights reserved..</p>
            </div>
        </footer>
    );
};

export default Footer;