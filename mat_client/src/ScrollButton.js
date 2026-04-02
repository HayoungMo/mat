import React, { useEffect, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Fab from '@mui/material/Fab';

const ScrollButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 200);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const goBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed', bottom: '40px', right: '30px',
            display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 999
        }}>
            <Fab size="small" onClick={goTop}
    sx={{ background: '#8a2130', color: 'white', '&:hover': { background: '#6d1a27' } }}>
    <KeyboardArrowUpIcon />
</Fab>
<Fab size="small" onClick={goBottom}
    sx={{ background: '#8a2130', color: 'white', '&:hover': { background: '#6d1a27' } }}>
    <KeyboardArrowDownIcon />
</Fab>
        </div>
    );
};

const btnStyle = {
    width: '44px', height: '44px',
    borderRadius: '50%',
    background: '#8a2130',
    color: 'white',
    border: 'none',
    border: '2px solid rgba(255,255,255,0.5)',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: '0.2s'
};

export default ScrollButton;