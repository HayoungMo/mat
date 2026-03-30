import React from 'react';
import { Link } from 'react-router-dom';

const SearchItem = ({item, keyword}) => {
    //하이라이트 로직 함수 : 텍스트에서 키워드를 찾아 <mark> 태그를 입힌다.
    const getHighlightedText = (text, query) => {
        if (!query) return text;

        //검색어를 기준으로 텍스트를 나눈다 (gi:대소문자 무시, 전체 찾기)
        const parts = text.split(new RegExp(`(${query})`, 'gi'));

        return parts.map((part,i) => 
        part.toLowerCase()=== query.toLowerCase()
        ? <mark key={i} style={{backgroundColor: '#ffeb3b',padding: '0 2px'}}>{part}</mark>
        : part
        );
    };
    return (
       
        <div style={{ marginBottom: '20px' }}>
            {/* 제목 하이라이트 */}
            <div>
                <Link to={`/city/${item.cityName}/article/${item._id}`}>
                    <strong>{getHighlightedText(item.title, keyword)}</strong>
                </Link>
            </div>
            
            {/* 본문 하이라이트 (제목 밑에 본문이 나옵니다) */}
            <div style={{ fontSize: '0.9em', color: '#666' }}>
                {getHighlightedText(
                    item.subject.length > 80 ? item.subject.substring(0, 80) + '...' : item.subject, 
                    keyword
                )}
            </div>
        </div>
    );
};

export default SearchItem;