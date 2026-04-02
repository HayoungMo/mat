import React from 'react';

const Loading = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                border: '5px solid #e0e0e0',
                borderTop: '5px solid grey',
                borderRadius: '50%',
                animation: 'spin 0.75s linear infinite'
            }} />
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loading;