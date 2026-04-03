import React, { useState, useRef } from 'react';
import { MdSearch } from "react-icons/md";

const BoardForm = ({ onSearch }) => {
    const [search, setSearch] = useState('');
    const debounceRef = useRef(null);

    const handleChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch(val);
        }, 500);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearch(search);
    };

    const handleClear = () => {
        setSearch('');
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearch('');
    };

    return (
        <form className="search-form" onSubmit={onSubmit}
            style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #d7ccc8', borderRadius: '24px', background: '#fff', overflow: 'hidden', transition: 'border-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = '#8a2130'}
            onBlur={e => e.currentTarget.style.borderColor = '#d7ccc8'}
        >
            <MdSearch style={{ flexShrink: 0, marginLeft: '14px', color: '#aaa', fontSize: '20px', pointerEvents: 'none' }} />

            <input
                type="text"
                className="search-input"
                placeholder="맛집명, 지역, 제목으로 검색하세요"
                style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', background: 'transparent' }}
                value={search}
                onChange={handleChange}
            />

            {search && (
                <button type="button" onClick={handleClear}
                    style={{ flexShrink: 0, background: 'none', border: 'none', color: '#bbb', fontSize: '15px', padding: '0 8px', cursor: 'pointer', lineHeight: 1 }}
                >✕</button>
            )}

            <button type="submit" className="btn-search">검색</button>
        </form>
    );
};

export default BoardForm;