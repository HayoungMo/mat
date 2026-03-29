import React, { useState } from 'react';
import BoardForm from './BoardForm';

const SURVEY_PER_PAGE = 3;  // 설문 한 페이지당 3개
const POSTS_PER_PAGE = 6;   // 게시글 한 페이지당 6개

const BoardList = ({ list = [], viewType, setViewType, onDetail, onSearch, onBookmark, loginUser }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [surveyPage, setSurveyPage] = useState(1);

    // ── 설문 목록 (최신순) ──
    const surveyList = list.filter(item => item.type === 'survey');
    const totalSurveyPages = Math.max(1, Math.ceil(surveyList.length / SURVEY_PER_PAGE));
    const pagedSurvey = surveyList.slice(
        (surveyPage - 1) * SURVEY_PER_PAGE,
        surveyPage * SURVEY_PER_PAGE
    );

    // ── 게시글 목록 (이미지형 or 목록형 or 북마크 목록, 최신순) ──
    const filteredList = list.filter(item => {
        
        if (viewType === 'bookmark') return item.isBookmarked === true;
        
        if (viewType === 'card') return item.type === 'image';
        
      
        if (viewType === 'list') return item.type === 'text';
        
        return false; 
    });
    
    const totalPages = Math.max(1, Math.ceil(filteredList.length / POSTS_PER_PAGE));
    
    const pagedList = filteredList.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const safeSetPage = (page, total, setter) => {
        if (page >= 1 && page <= total) setter(page);
    };

    const getPercent = (votes, idx, total) => {
        if (!total) return 0;
        return Math.round((Number(votes[idx] || 0) / total) * 100);
    };

    return (
        <div className="list-container">

            {/* ── 설문 섹션 ── */}
            {surveyList.length > 0 && (
                <div className="survey-section">
                    <div className="survey-section-header">
                        <span className="survey-section-title">📊 맛잘러들에게 물어보기</span>
                        <span className="survey-section-count">
                         
                         {/* 여기 type:survey  총갯수  */}
                            {surveyPage} / {totalSurveyPages} 
                        </span>
                    </div>

                    <div className="survey-top-section">
                        {pagedSurvey.map((item) => {
                            let options = [];
                            try {
                                options = JSON.parse(item.subject);
                            } catch {
                                options = (item.subject || '').split('^').filter(Boolean);
                            }
                            const votes = item.votedCount || options.map(() => 0);
                            const total = votes.reduce((a, b) => Number(a) + Number(b), 0);

                            return (
                                <div
                                    key={item._id}
                                    className="survey-summary-box"
                                    onClick={() => onDetail(item)}
                                >
                                    <h4>📊 {item.title}</h4>
                                    <p className="survey-author">👤 작성자: {item.userId}</p>
                                    {options.slice(0, 3).map((opt, idx) => {
                                        const pct = getPercent(votes, idx, total);
                                        return (
                                            <div key={idx} className="survey-bar-row">
                                                <div className="survey-bar-label">
                                                    <span>{opt}</span>
                                                    <span>{pct}%</span>
                                                </div>
                                                <div className="survey-bar-bg">
                                                    <div className="survey-bar-fill" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <p className="survey-total"> 총 몇명 투표중 {total}표</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* 설문 페이징 */}
                    {totalSurveyPages > 1 && (
                        <div className="pagination survey-pagination">
                            <button onClick={() => safeSetPage(1, totalSurveyPages, setSurveyPage)} disabled={surveyPage === 1}>«</button>
                            <button onClick={() => safeSetPage(surveyPage - 1, totalSurveyPages, setSurveyPage)} disabled={surveyPage === 1}>‹</button>
                            {Array.from({ length: totalSurveyPages }, (_, i) => i + 1).map(num => (
                                <button
                                    key={num}
                                    className={surveyPage === num ? 'active' : ''}
                                    onClick={() => safeSetPage(num, totalSurveyPages, setSurveyPage)}
                                >{num}</button>
                            ))}
                            <button onClick={() => safeSetPage(surveyPage + 1, totalSurveyPages, setSurveyPage)} disabled={surveyPage === totalSurveyPages}>›</button>
                            <button onClick={() => safeSetPage(totalSurveyPages, totalSurveyPages, setSurveyPage)} disabled={surveyPage === totalSurveyPages}>»</button>
                        </div>
                    )}
                </div>
            )}

            {/* ── 검색창 ── */}
            <div className="search-section">
                <BoardForm onSearch={(kw) => { onSearch(kw); setCurrentPage(1); setSurveyPage(1); }} />
            </div>

            {/* ── 뷰타입 + 게시글 수 ── */}
            <div className="list-controls">
                <span className="list-count">📋 게시글 ({filteredList.length})</span>
                <div className="view-type-buttons">
                  <button 
                        className={viewType === 'card' ? 'active' : ''} 
                        onClick={() => setViewType('card')}
                        >
                        🖼️ 이미지형
                    </button>
                    <button 
                        className={viewType === 'list' ? 'active' : ''} 
                        onClick={() => setViewType('list')}
                         >
                         📝 목록형
                    </button>
                    {/* 북마크 버튼 추가 */}
                    <button 
                        className={viewType === 'bookmark' ? 'active' : ''} 
                        onClick={() => setViewType('bookmark')}
                        >
                            <span className="bookmark-icon">
                                {viewType === 'bookmark' ? '⭐' : '☆'}
                            </span>
                    </button>
                </div>
            </div>

            {/* ── 게시글 목록 ── */}
            <div className={viewType === 'card' ? 'card-grid' : 'list-table'}>
                {pagedList.length === 0 ? (
                    <div className="empty-msg">게시글이 없습니다.</div>
                ) : (
                    pagedList.map((item) => (
                        <div
                            key={item._id}
                            className="card-item"
                            onClick={() => onDetail(item)}
                        >
                            {viewType === 'card' && (
                                <img
                                    src={item.saveFileName
                                        ? `http://localhost:4000/uploads/${item.saveFileName}`
                                        : '/no-image.png'}
                                    alt=""
                                    className="card-img"
                                />
                            )}
                            <div className="card-info">
                                <div className="card-info-top">
                                    <h3>{item.title}</h3>
                                    <span
                                        className="bookmark-btn"
                                        title="북마크"
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            if (!loginUser) {
                                                return alert("로그인한 사용자만 북마크를 이용할 수 있습니다.");
                                            }
                                            onBookmark(item._id);
                                        }}
                                    >
                                        {item.isBookmarked ? '⭐' : '☆'}
                                    </span>
                                </div>
                                {item.region && <span className="tag">#{item.region}</span>}
                                <p className="card-meta">
                                    👤 {item.userId}
                                    {viewType === 'list' && (
                                        <span className="card-date">
                                            &nbsp;|&nbsp;{new Date(item.sysdate).toLocaleDateString()}
                                        </span>
                                    )}
                                    &nbsp;|&nbsp; 👀 {item.readCount || 0}
                                </p>
                            </div>
                            {viewType === 'list' && (
                                <button
                                    className="btn-view"
                                    onClick={(e) => { e.stopPropagation(); onDetail(item); }}
                                >보기</button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ── 게시글 페이징 ── */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => safeSetPage(1, totalPages, setCurrentPage)} disabled={currentPage === 1}>«</button>
                    <button onClick={() => safeSetPage(currentPage - 1, totalPages, setCurrentPage)} disabled={currentPage === 1}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                        <button
                            key={num}
                            className={currentPage === num ? 'active' : ''}
                            onClick={() => safeSetPage(num, totalPages, setCurrentPage)}
                        >{num}</button>
                    ))}
                    <button onClick={() => safeSetPage(currentPage + 1, totalPages, setCurrentPage)} disabled={currentPage === totalPages}>›</button>
                    <button onClick={() => safeSetPage(totalPages, totalPages, setCurrentPage)} disabled={currentPage === totalPages}>»</button>
                </div>
            )}
        </div>
    );
};

export default BoardList;