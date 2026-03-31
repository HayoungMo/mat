import React from 'react';

const Search = ({ keyword, setKeyword, onSearch }) => {
    return (
        <form onSubmit={onSearch}>
            키워드 : 
            <input 
                type="text" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                size="15" 
            /> 
            <button type="submit">검색하기</button> 
        </form>
    );
};

export default Search;