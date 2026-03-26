import React, { useEffect, useState } from 'react';

const BoardForm = ({ onSearch }) => {
    const [search, setSearch] = useState('');

    // 1. 입력창 값 변경
    const changeInput = (evt) => {
        setSearch(evt.target.value);
    };

    // 2. 실시간 검색 (search값이 바뀔 때마다 부모의 검색 함수 호출)
    useEffect(() => {
        onSearch(search);
    }, [search, onSearch]);

    // 3. 엔터 쳤을 때 처리
    const onSubmit = (evt) => {
        evt.preventDefault();
        // 검색어가 없어도 전체 리스트를 보여주기 위해 그대로 넘김
        onSearch(search);
        setSearch(''); // 입력창 초기화 (선택 사항)
    };

    return (
        <form onSubmit={onSubmit}>
            {/* 스타일 없이 순수 태그만 구성 */}
            <input 
                type="text" 
                placeholder="맛집명, 지역, 제목으로 검색..." 
                value={search} 
                onChange={changeInput} 
            />
            <button type="submit">검색</button>
        </form>
    );
};

export default BoardForm;