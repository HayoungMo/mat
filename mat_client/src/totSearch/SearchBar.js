import React from 'react';

const SearchBar = ({keyword, setKeyword,onSearch }) => {
    return (
        <div>
            <input 
                value={keyword} 
                onChange={e => setKeyword(e.target.value)}
                placeholder="검색어를 입력해주세요"
                onKeyDown={e => {
                    if (e.key === 'Enter'){
                        onSearch();
                    }
                }}
            />
            <button onClick={onSearch}>검색</button>
        </div>
    );
};

export default SearchBar;