import React, { useEffect, useState } from 'react';

const BoardForm = ({ onSearch }) => {
    const [search, setSearch] = useState('');

    // 실시간 검색 (입력 즉시 반응)
    useEffect(() => {
        onSearch(search);
    }, [search, onSearch]);

    const onSubmit = (e) => {
        e.preventDefault();
        onSearch(search);
    };

    return (
        <form className="search-form" onSubmit={onSubmit}>
            <input
                type="text"
                className="search-input"
                placeholder="🔍 맛집명, 지역, 제목으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-search">검색</button>
        </form>
    );
};

export default BoardForm;
