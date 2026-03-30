import React, { useState } from 'react';
import BoardForm from './BoardForm';

const SURVEY_PER_PAGE = 3;
const POSTS_PER_PAGE = 6;

const BoardList = ({ 
    list, viewType, setViewType, onDetail, cities, 
    selectedCity, setSelectedCity, loginUser, onSearch, onBookmark 
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [surveyPage, setSurveyPage] = useState(1);

    // 설문 데이터 필터링 및 페이지네이션
    const surveyList = list.filter(item => item.type === 'survey');
    const totalSurveyPages = Math.max(1, Math.ceil(surveyList.length / SURVEY_PER_PAGE));
    const pagedSurvey = surveyList.slice((surveyPage - 1) * SURVEY_PER_PAGE, surveyPage * SURVEY_PER_PAGE);

  
    const isItemBookmarked = (item) => {
        if (!loginUser) return false;
        if (!item.isBookmarked) return false;
        if (Array.isArray(item.isBookmarked)) {
            return item.isBookmarked.includes(loginUser);
        }
        return item.isBookmarked === true;
    };

   

    const detectRegionInPost = (item, city) => {
        if (city === '전체') return true;
        const fields = [item.title, item.subject, item.address].filter(Boolean).join(' ');
     
        if (fields.includes(city)) return true;
     
        const short = city.replace(/(구|시|동)$/, '');
        if (short && short !== city) return fields.includes(short);
        return false;
    };

    // 설문 제외 + 지역 + 뷰타입 필터를 한번에 처리
    const filteredList = list.filter(item => {
        if (item.type === 'survey') return false;

        const matchesCity = detectRegionInPost(item, selectedCity);
        if (!matchesCity) return false;

        if (viewType === 'bookmark') return isItemBookmarked(item);
        if (viewType === 'card') return item.type === 'image';
        if (viewType === 'list') return item.type === 'text' || !item.saveFileName;

        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredList.length / POSTS_PER_PAGE));
    const pagedList = filteredList.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

    const handleSetViewType = (type) => {
        setViewType(type);
        setCurrentPage(1);
    };

  
    const getPercent = (votes, idx, total) => {
        if (!total) return 0;
        return Math.round((Number(votes[idx] || 0) / total) * 100);
    };

  
    const getCityCount = (city) => {
        return list.filter(item => {
            if (item.type === 'survey') return false;
            return detectRegionInPost(item, city);
        }).length;
    };

    return (
        <div className="list-container" style={{ padding: '20px' }}>

            {/* ── 상단 설문 섹션 ── */}
            {surveyList.length > 0 && (
                <div className="survey-section" style={{ border: '2px dashed #ffb3b3', borderRadius: '15px', padding: '20px', marginBottom: '20px', background: '#fff' }}>
                    <div className="survey-section-header" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>📊 맛잘러들에게 물어보기</span>
                        {totalSurveyPages > 1 && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    onClick={() => setSurveyPage(p => Math.max(1, p - 1))}
                                    disabled={surveyPage === 1}
                                    style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer' }}
                                >◀</button>
                                <span style={{ fontSize: '13px', color: '#999', lineHeight: '28px' }}>{surveyPage} / {totalSurveyPages}</span>
                                <button
                                    onClick={() => setSurveyPage(p => Math.min(totalSurveyPages, p + 1))}
                                    disabled={surveyPage === totalSurveyPages}
                                    style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer' }}
                                >▶</button>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        {pagedSurvey.map((item) => {
                            let options = [];
                            try { options = JSON.parse(item.subject); } catch { options = (item.subject || '').split('^').filter(Boolean); }
                            const votes = item.votedCount || options.map(() => 0);
                            const total = votes.reduce((a, b) => Number(a) + Number(b), 0);
                            return (
                                <div key={item._id} onClick={() => onDetail(item)} style={{ background: '#fff8f8', padding: '15px', borderRadius: '10px', cursor: 'pointer', border: '1px dashed #ffb3b3' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#ff6b6b', fontSize: '14px' }}>🗳️ {item.title}</h4>
                                 {options.map((opt, idx) => ( 
                                    <div key={idx} style={{ background: '#fff', border: '1px solid #eee', padding: '8px', marginTop: '5px', borderRadius: '5px', fontSize: '13px' }}>
                                        {opt} ({getPercent(votes, idx, total)}%)
                                    </div>
                                    ))}
                                    <p style={{ fontSize: '11px', color: '#aaa', margin: '8px 0 0', textAlign: 'right' }}>총 {total}명 참여</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── 검색바 ── */}
            <div className="search-section" style={{ marginBottom: '20px' }}>
                <BoardForm onSearch={(kw) => { onSearch(kw); setCurrentPage(1); }} />
            </div>

            {/* ── 지역 필터 탭 (게시글 수 뱃지 포함) ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' }}>
                {cities.map(city => {
                    const count = getCityCount(city);
                    const isActive = selectedCity === city;
                    return (
                        <span
                            key={city}
                            onClick={() => { setSelectedCity(city); setCurrentPage(1); }}
                            style={{
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: '6px 15px',
                                borderRadius: '20px',
                                backgroundColor: isActive ? '#ff6b6b' : '#f0f0f0',
                                color: isActive ? '#fff' : '#555',
                                fontWeight: isActive ? 'bold' : 'normal',
                                transition: '0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                            }}
                        >
                            {city}
                            {/* 지역별 게시글 수 뱃지 */}
                            <span style={{
                                fontSize: '11px',
                                backgroundColor: isActive ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.1)',
                                borderRadius: '10px',
                                padding: '1px 6px',
                                fontWeight: 'bold',
                            }}>
                                {count}
                            </span>
                        </span>
                    );
                })}
            </div>

            {/* ── 뷰 타입 컨트롤 ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    📝 게시글 ({filteredList.length})
                    {selectedCity !== '전체' && (
                        <span style={{ fontSize: '13px', color: '#ff6b6b', marginLeft: '8px' }}>— {selectedCity}</span>
                    )}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                        { key: 'card',     label: '🖼️ 이미지형' },
                        { key: 'list',     label: '📝 목록형' },
                        { key: 'bookmark', label: viewType === 'bookmark' ? '⭐ 북마크' : '☆ 북마크' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => handleSetViewType(key)}
                            style={{
                                padding: '6px 12px', borderRadius: '8px',
                                border: '1px solid #ddd',
                                background: viewType === key ? '#ff6b6b' : '#fff',
                                color: viewType === key ? '#fff' : '#333',
                                cursor: 'pointer',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── 메인 게시글 목록 ── */}
            {pagedList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#bbb', fontSize: '15px' }}>
                    {viewType === 'bookmark'
                        ? (loginUser ? '북마크한 게시글이 없습니다.' : '로그인 후 북마크를 이용해보세요!')
                        : `${selectedCity !== '전체' ? `[${selectedCity}] ` : ''}게시글이 없습니다.`}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    /* 카드형: 항상 4열 고정 / 목록형: 1열 */
                    gridTemplateColumns: viewType === 'card' ? 'repeat(4, 1fr)' : '1fr',
                    gap: '20px',
                }}>
                    {pagedList.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => onDetail(item)}
                            style={{
                                cursor: 'pointer',
                                border: '1px solid #eee',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: viewType === 'card' ? 'column' : 'row',
                                alignItems: viewType === 'list' ? 'center' : 'stretch',
                                padding: viewType === 'list' ? '15px' : '0',
                                background: '#fff',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                /* 카드형일 때 높이 고정 → 모든 카드 동일한 크기 */
                                height: viewType === 'card' ? '260px' : 'auto',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'; }}
                        >
                            {/* 이미지형일 때만 썸네일 출력 — 고정 높이로 균일하게 */}
                            {viewType === 'card' && (
                                <div style={{ width: '100%', height: '170px', background: '#f5f5f5', flexShrink: 0 }}>
                                    <img
                                        src={item.saveFileName ? `http://localhost:4000/uploads/${item.saveFileName}` : '/no-image.png'}
                                        alt="thumb"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            {/* 텍스트 영역: flex:1로 남은 공간 채움 */}
                            <div style={{ padding: viewType === 'card' ? '12px 14px' : '0 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                {/* 제목 + 북마크 별 아이콘 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontSize: '14px', margin: '0', color: '#333', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.4' }}>
                                        {item.address && (
                                            <span style={{ color: '#ff6b6b', fontSize: '11px', marginRight: '4px' }}>
                                                [{item.address.split(' ')[0]}]
                                            </span>
                                        )}
                                        {item.title}
                                    </h3>
                                    {/* 별 + 숫자를 하나의 pill 묶음으로 */}
                                    <span
                                        onClick={(e) => { e.stopPropagation(); onBookmark(item._id); }}
                                        style={{
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '3px',
                                            marginLeft: '6px',
                                            flexShrink: 0,
                                            padding: '2px 8px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            background: isItemBookmarked(item) ? '#fff0f0' : '#f5f5f5',
                                            color: isItemBookmarked(item) ? '#ff6b6b' : '#aaa',
                                            border: `1px solid ${isItemBookmarked(item) ? '#ffb3b3' : '#e0e0e0'}`,
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {isItemBookmarked(item) ? '⭐' : '☆'}&nbsp;{Array.isArray(item.isBookmarked) ? item.isBookmarked.length : 0}
                                    </span>
                                </div>

                                {/* 메타: 작성자 / 조회수 */}
                                <div style={{ fontSize: '12px', color: '#999', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                    <span>👤 {item.userId}</span>
                                    <span>👀 {item.readCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── 페이지네이션 ── */}
            {totalPages > 1 && (
                <div style={{ textAlign: 'center', marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '5px 10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer' }}
                    >◀</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{
                                padding: '5px 10px', border: '1px solid #ddd', borderRadius: '5px',
                                background: currentPage === i + 1 ? '#ff6b6b' : '#fff',
                                color: currentPage === i + 1 ? '#fff' : '#333',
                                cursor: 'pointer',
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '5px 10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer' }}
                    >▶</button>
                </div>
            )}
        </div>
    );
};

export default BoardList;