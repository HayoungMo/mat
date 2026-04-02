import React, { useState, useRef } from 'react';
import { MdSearch } from "react-icons/md";

const BoardForm = ({ onSearch }) => {
    const [search, setSearch] = useState('');
    const debounceRef = useRef(null); // 타자 입력 지연(Debounce)용 타이머

    // 입력값이 변경될 때 실행 (실시간 검색)
    const handleChange = (e) => {
        const val = e.target.value;
        setSearch(val);

        // 이전 타이머가 있다면 취소해서 서버 요청 과부하 방지
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // 0.5초 동안 입력이 없으면 검색 실행
        debounceRef.current = setTimeout(() => {
            onSearch(val);
            console.log("실시간 검색 실행:", val);
        }, 500);
    };

    // 엔터키를 눌렀을 때 실행
    const onSubmit = (e) => {
        e.preventDefault();
        // 엔터 시에는 기다리지 않고 즉시 검색
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearch(search);
    };

    // X 버튼 클릭 시 초기화
    const handleClear = () => {
        setSearch('');
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearch(''); // 빈 값으로 목록 초기화
    };

    return (
        <form className="search-form" onSubmit={onSubmit}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                <MdSearch style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    color: '#888', 
                    fontSize: '20px' 
                }} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="맛집명, 지역, 제목으로 검색하세요" 
                    style={{ paddingLeft: '45px' }}
                    value={search}
                    onChange={handleChange}
                />
            </div>
            
            {/* 검색어가 있을 때만 X 버튼 표시 */}
            {search && (
                <button type="button" onClick={handleClear} className="btn-clear-search">✕</button>
            )}
            
            <button type="submit" className="btn-search">검색</button>
        </form>
    );
};

export default BoardForm;