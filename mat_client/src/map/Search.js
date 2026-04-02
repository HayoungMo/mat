import React from 'react';

const Search = ({ keyword, setKeyword, onSearch }) => {
    return (
        <form onSubmit={onSearch}>
            <input 
                type="text" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="장소 검색" 
            /> 
            <button type="submit">검색</button> 
        </form>
    );
};

export default Search;