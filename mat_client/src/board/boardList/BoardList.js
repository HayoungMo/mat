import React, { useState } from 'react';
import BoardForm from './BoardForm';
// ✅ 리액트 아이콘 임포트
import { 
    MdPoll, MdChevronLeft, MdChevronRight, MdHowToVote, 
    MdSearch, MdPerson, MdVisibility, MdGridView, MdViewList,
    MdStar, MdStarBorder, MdLocationOn
} from "react-icons/md";

const SURVEY_PER_PAGE = 3;
const POSTS_PER_PAGE = 6;

const BoardList = ({ 
    list, viewType, setViewType, onDetail, cities, 
    selectedCity, setSelectedCity, loginUser, onSearch, onBookmark 
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [surveyPage, setSurveyPage] = useState(1);

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
                        <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MdPoll style={{ color: '#ff6b6b', fontSize: '20px' }} /> 맛잘러들에게 물어보기
                        </span>
                        {totalSurveyPages > 1 && (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setSurveyPage(p => Math.max(1, p - 1))}
                                    disabled={surveyPage === 1}
                                    style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer', display: 'flex' }}
                                ><MdChevronLeft /></button>
                                <span style={{ fontSize: '13px', color: '#999' }}>{surveyPage} / {totalSurveyPages}</span>
                                <button
                                    onClick={() => setSurveyPage(p => Math.min(totalSurveyPages, p + 1))}
                                    disabled={surveyPage === totalSurveyPages}
                                    style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer', display: 'flex' }}
                                ><MdChevronRight /></button>
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
                                    <h4 style={{ margin: '0 0 10px 0', color: '#8a2130', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <MdHowToVote /> {item.title}
                                    </h4>
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

            {/* ── 지역 필터 탭 ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' }}>
                {cities.map(city => {
                    const count = getCityCount(city);
                    const isActive = selectedCity === city;
                    return (
                        <span
                            key={city}
                            onClick={() => { setSelectedCity(city); setCurrentPage(1); }}
                            style={{
                                cursor: 'pointer', fontSize: '14px', padding: '6px 15px', borderRadius: '20px',
                                backgroundColor: isActive ? '#8a2130' : '#f0f0f0',
                                color: isActive ? '#fff' : '#555',
                                fontWeight: isActive ? 'bold' : 'normal',
                                transition: '0.2s', display: 'flex', alignItems: 'center', gap: '5px',
                            }}
                        >
                            {city}
                            <span style={{
                                fontSize: '11px', backgroundColor: isActive ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.1)',
                                borderRadius: '10px', padding: '1px 6px', fontWeight: 'bold',
                            }}>
                                {count}
                            </span>
                        </span>
                    );
                })}
            </div>

            {/* ── 뷰 타입 컨트롤 ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    게시글 ({filteredList.length})
                    {selectedCity !== '전체' && (
                        <span style={{ fontSize: '13px', color: '#8a2130', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <MdLocationOn size={14}/> {selectedCity}
                        </span>
                    )}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                        { key: 'card', label: '카드형', icon: <MdGridView /> },
                        { key: 'list', label: '목록형', icon: <MdViewList /> },
                        { key: 'bookmark', label: '북마크', icon: viewType === 'bookmark' ? <MdStar /> : <MdStarBorder /> },
                    ].map(({ key, label, icon }) => (
                        <button
                            key={key}
                            onClick={() => handleSetViewType(key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd',
                                background: viewType === key ? '#8a2130' : '#fff',
                                color: viewType === key ? '#fff' : '#333', cursor: 'pointer',
                            }}
                        >
                            {icon} {label}
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
                    gridTemplateColumns: viewType === 'card' ? 'repeat(4, 1fr)' : '1fr',
                    gap: '20px',
                }}>
                    {pagedList.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => onDetail(item)}
                            style={{
                                cursor: 'pointer', border: '1px solid #eee', borderRadius: '15px',
                                overflow: 'hidden', display: 'flex',
                                flexDirection: viewType === 'card' ? 'column' : 'row',
                                alignItems: viewType === 'list' ? 'center' : 'stretch',
                                padding: viewType === 'list' ? '15px' : '0',
                                background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                height: viewType === 'card' ? '260px' : 'auto',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'; }}
                        >
                            {viewType === 'card' && (
                                <div style={{ width: '100%', height: '170px', background: '#f5f5f5', flexShrink: 0 }}>
                                    <img
                                        src={item.saveFileName ? `/uploads/${item.saveFileName}` : '/no-image.png'}
                                        alt="thumb"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            <div style={{ padding: viewType === 'card' ? '12px 14px' : '0 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontSize: '14px', margin: '0', color: '#333', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.4' }}>
                                        {item.address && (
                                            <span style={{ color: '#8a2130', fontSize: '11px', marginRight: '4px' }}>
                                                [{item.address.split(' ')[0]}]
                                            </span>
                                        )}
                                        {item.title}
                                    </h3>
                                    <span
                                        onClick={(e) => { e.stopPropagation(); onBookmark(item._id); }}
                                        style={{
                                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px',
                                            marginLeft: '6px', flexShrink: 0, padding: '2px 8px', borderRadius: '20px',
                                            fontSize: '12px', fontWeight: 'bold',
                                          
                                            background: isItemBookmarked(item) ? '#fff0f0' : '#f5f5f5',
                                            border: `1px solid ${isItemBookmarked(item) ? '#f5f5f5' : '#e0e0e0'}`,
                                            // 전체 글자(숫자) 색상은 북마크 시 붉은색, 아닐 시 회색
                                            color: isItemBookmarked(item) ? '#8a2130' : '#aaa',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {/* 별 아이콘 부분만 스타일 추가 */}
                                        {isItemBookmarked(item) ? (
                                            <MdStar style={{ color: '#ffca28', fontSize: '14px' }} /> 
                                        ) : (
                                            <MdStarBorder style={{ fontSize: '14px' }} />
                                        )}
                                        
                                        {/* 북마크 숫자 */}
                                        {Array.isArray(item.isBookmarked) ? item.isBookmarked.length : 0}
                                    </span>
                                </div>

                                <div style={{ fontSize: '12px', color: '#093c71', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MdPerson /> {item.userId}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MdVisibility /> {item.readCount || 0}</span>
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
                        style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    ><MdChevronLeft size={18}/></button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{
                                padding: '5px 12px', border: '1px solid #ddd', borderRadius: '5px',
                                background: currentPage === i + 1 ? ' #093c71' : '#fff',
                                color: currentPage === i + 1 ? '#fff' : '#333',
                                cursor: 'pointer', fontSize: '13px'
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    ><MdChevronRight size={18}/></button>
                </div>
            )}
        </div>
    );
};

export default BoardList;