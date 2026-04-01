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
                    <span>사업자등록번호: 000-00-00000</span>
                </div>
                <div className="footer-address">
                    <span>서울특별시 강남구 혁신로 123 발로란티스 타워 24F</span>
                </div>
                <div className="footer-contact">
                    <a href="https://open.kakao.com/o/sDZGgOni" target="_blank" rel="noreferrer" className="cs-number cs-link">
                    카카오 문의하기
                    </a>
                    <span className="footer-bar">|</span>
                    <span>이메일: support@valorantis.com</span>
                </div>
                <p className="copy">© 2024 VALORANTIS SYSTEMS. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
};

export default Footer;