import React, { useEffect, useState } from 'react';

const CityMessage = ({ msg, isShow, setIsShow }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!isShow) return;
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => setIsShow(false), 300); // 페이드아웃 후 제거
        }, 3000);

        return () => clearTimeout(timer);
    }, [isShow]);

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
            opacity: visible ? 1 : 0,
            transition: 'all 0.3s ease',
            backgroundColor: '#333',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
        }}>
            {msg}
        </div>
    );
};

export default CityMessage;