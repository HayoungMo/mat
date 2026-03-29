import React, { useState } from 'react';
import BoardForm from './BoardForm';

const SURVEY_PER_PAGE = 3;
const POSTS_PER_PAGE = 6;

const BoardList = ({ 
    list, viewType, setViewType, onDetail, cities, 
    selectedCity, setSelectedCity, loginUser, onSearch, onBookmark 
}) => {
    // 페이지네이션 상태 관리
    const [currentPage, setCurrentPage] = useState(1);
    const [surveyPage, setSurveyPage] = useState(1);

    // 1. 설문 데이터 필터링 및 페이지네이션 로직
    const surveyList = list.filter(item => item.type === 'survey');
    const totalSurveyPages = Math.max(1, Math.ceil(surveyList.length / SURVEY_PER_PAGE));
    const pagedSurvey = surveyList.slice((surveyPage - 1) * SURVEY_PER_PAGE, surveyPage * SURVEY_PER_PAGE);

   
        const isItemBookmarked = (item) => {
            // ✅ 로그인하지 않았다면 무조건 false 반환 (초기화 효과)
            if (!loginUser) return false; 
            
            if (!item.isBookmarked) return false;
            if (Array.isArray(item.isBookmarked)) {
                return item.isBookmarked.includes(loginUser);
            }
            return item.isBookmarked === true;
        };

   
        const filteredList = list.filter(item => {
            if (item.type === 'survey') return false; 
            
            // 지역 필터링 로직 강화
            const isAll = selectedCity === "전체";
            
            // 1. 주소(address)에 포함되어 있는지
            const inAddress = item.address && item.address.includes(selectedCity);
            // 2. 제목(title)에 포함되어 있는지
            const inTitle = item.title && item.title.includes(selectedCity);
            // 3. 내용/옵션(subject)에 포함되어 있는지
            const inSubject = item.subject && String(item.subject).includes(selectedCity);

            const matchesCity = isAll || inAddress || inTitle || inSubject;
            
            if (!matchesCity) return false;

            // 뷰타입 필터링
            if (viewType === 'bookmark') return isItemBookmarked(item);
            if (viewType === 'card') return item.type === 'image';
            if (viewType === 'list') return item.type === 'text' || !item.saveFileName;

            return true;
        });

    const totalPages = Math.max(1, Math.ceil(filteredList.length / POSTS_PER_PAGE));
    const pagedList = filteredList.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

    // 4. 이벤트 핸들러
    const handleSetViewType = (type) => {
        setViewType(type);
        setCurrentPage(1); // 뷰 전환 시 페이지 초기화
    };

    const getPercent = (votes, idx, total) => {
        if (!total) return 0;
        return Math.round((Number(votes[idx] || 0) / total) * 100);
    };

    return (
        <div className="list-container" style={{ padding: '20px' }}>
            
            {/* ── 상단 설문 섹션 ── */}
            {surveyList.length > 0 && (
                <div className="survey-section" style={{ border: '1px solid #eee', borderRadius: '15px', padding: '20px', marginBottom: '20px', background: '#fff' }}>
                    <div className="survey-section-header" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                        <span className="survey-section-title" style={{ fontWeight: 'bold' }}>📊 맛잘러들에게 물어보기 {surveyPage} / {totalSurveyPages}</span>
                    </div>
                    <div className="survey-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        {pagedSurvey.map((item) => {
                            let options = [];
                            try { options = JSON.parse(item.subject); } catch { options = (item.subject || '').split('^').filter(Boolean); }
                            const votes = item.votedCount || options.map(() => 0);
                            const total = votes.reduce((a, b) => Number(a) + Number(b), 0);
                            return (
                                <div key={item._id} className="survey-box" onClick={() => onDetail(item)} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', cursor: 'pointer' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#ff6b6b' }}>🗳️ {item.title}</h4>
                                    {options.slice(0, 2).map((opt, idx) => (
                                        <div key={idx} style={{ background: '#fff', border: '1px solid #eee', padding: '8px', marginTop: '5px', borderRadius: '5px', fontSize: '13px' }}>
                                            {opt} ({getPercent(votes, idx, total)}%)
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── 검색바 섹션 ── */}
            <div className="search-section" style={{ marginBottom: '20px' }}>
                <BoardForm onSearch={(kw) => { onSearch(kw); setCurrentPage(1); }} />
            </div>

            {/* ── 지역 필터 태그 ── */}
            <div className="city-tags" style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
                {cities.map(city => (
                    <span 
                        key={city}
                        onClick={() => { setSelectedCity(city); setCurrentPage(1); }}
                        style={{
                            cursor: 'pointer', fontSize: '14px', padding: '6px 15px', borderRadius: '20px',
                            backgroundColor: selectedCity === city ? '#ff6b6b' : '#f0f0f0',
                            color: selectedCity === city ? '#fff' : '#555',
                            fontWeight: selectedCity === city ? 'bold' : 'normal',
                            transition: '0.2s'
                        }}
                    >
                        {city}
                    </span>
                ))}
            </div>

            {/* ── 뷰 타입 컨트롤 (북마크 포함) ── */}
            <div className="list-controls" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>📝 게시글 ({filteredList.length})</span>
                <div className="view-buttons" style={{ display: 'flex', gap: '8px' }}>

                    <button onClick={() => handleSetViewType('card')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd', background: viewType === 'card' ? '#ff6b6b' : '#fff', color: viewType === 'card' ? '#fff' : '#333', cursor: 'pointer' }}>🖼️ 이미지형</button>
                    <button onClick={() => handleSetViewType('list')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd', background: viewType === 'list' ? '#ff6b6b' : '#fff', color: viewType === 'list' ? '#fff' : '#333', cursor: 'pointer' }}>📝 목록형</button>
                    <button onClick={() => handleSetViewType('bookmark')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd', background: viewType === 'bookmark' ? '#ff6b6b' : '#fff', color: viewType === 'bookmark' ? '#fff' : '#333', cursor: 'pointer' }}>
                        {viewType === 'bookmark' ? '⭐' : '☆'} 북마크
                    </button>
                </div>
            </div>

            {/* ── 메인 리스트 출력 ── */}
            <div className="board-main-list" style={{ 
                display: 'grid', 
                gridTemplateColumns: viewType === 'card' ? 'repeat(auto-fill, minmax(220px, 1fr))' : '1fr', 
                gap: '20px' 
            }}>
                {pagedList.map((item) => (
                    <div key={item._id} className="item-card" onClick={() => onDetail(item)} style={{ 
                        cursor: 'pointer', border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden',
                        display: 'flex', flexDirection: viewType === 'card' ? 'column' : 'row',
                        padding: viewType === 'list' ? '15px' : '0', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                        {/* ✅ 이미지형일 때만 사진 출력 */}
                        {viewType === 'card' && (
                            <div style={{ width: '100%', height: '160px', background: '#f5f5f5' }}>
                                <img src={item.saveFileName ? `http://localhost:4000/uploads/${item.saveFileName}` : '/no-image.png'} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        
                        <div style={{ padding: viewType === 'card' ? '15px' : '0 10px', flex: 1, width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontSize: '16px', margin: '0', color: '#333' }}>
                                    {item.address && <span style={{ color: '#ff6b6b', fontSize: '13px', marginRight: '5px' }}>[{item.address.split(' ')[0]}]</span>}
                                    {item.title}
                                </h3>
                                {/* ✅ 개별 북마크 별 아이콘 복구 */}
                                <span 
                                    style={{ cursor: 'pointer', fontSize: '20px', marginLeft: '10px' }}
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        onBookmark(item._id); 
                                    }}
                                >
                                    {isItemBookmarked(item) ? '⭐' : '☆'}
                                </span>
                            </div>
                            <div style={{ marginTop: '8px', fontSize: '13px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                                <span>👤 {item.userId}</span>
                                <span>👀 {item.readCount || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── 페이지네이션 (간략) ── */}
            {totalPages > 1 && (
                <div className="pagination" style={{ textAlign: 'center', marginTop: '30px' }}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)} style={{ margin: '0 5px', padding: '5px 10px', border: '1px solid #ddd', background: currentPage === i + 1 ? '#ff6b6b' : '#fff', color: currentPage === i + 1 ? '#fff' : '#333', borderRadius: '5px' }}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BoardList;