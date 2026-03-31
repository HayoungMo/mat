import React, { useState, useRef } from 'react';

const BoardForm = ({ onSearch }) => {
    const [search, setSearch] = useState('');
    const debounceRef = useRef(null); // 타이머를 저장할 객체

    const handleChange = (e) => {
        const val = e.target.value;
        setSearch(val);

        // 1. 이전에 설정된 타이머가 있다면 취소 (연속 입력 시 초기화)
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // 2. 500ms(0.5초) 후에 onSearch를 실행하도록 예약
        debounceRef.current = setTimeout(() => {
            onSearch(val);
            console.log("실시간 검색 실행:", val);
        }, 500);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // 엔터를 눌렀을 때는 기다리지 않고 바로 검색
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearch(search);
    };

    const handleClear = () => {
        setSearch('');
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearch(''); // 검색어 초기화 시 목록도 초기화
    };

    return (
        <form className="search-form" onSubmit={onSubmit}>
            <input
                type="text"
                className="search-input"
                placeholder="🔍 맛집명, 지역, 제목으로 검색..."
                value={search}
                onChange={handleChange}
            />
            {search && (
                <button type="button" onClick={handleClear} className="btn-clear-search">✕</button>
            )}
            <button type="submit" className="btn-search">검색</button>
        </form>
    );
};

export default BoardForm;