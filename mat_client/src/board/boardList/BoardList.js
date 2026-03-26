import React, { useState } from 'react';
import BoardForm from './BoardForm';

const POSTS_PER_PAGE = 6;

const BoardList = ({ list = [], viewType, setViewType, onDetail, onSearch, onBookmark }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // 상단에 보여줄 설문 게시물 (최대 3개)
    const surveyItems = list.filter(item => item.type === 'survey').slice(0, 3);

    // 현재 뷰타입에 맞게 필터링
    // card: image 타입, list: text 타입, 모두 보기 원하면 아래 주석 해제 후 교체 가능
    const filteredList = list.filter(item => {
        if (viewType === 'card') return item.type === 'image';
        if (viewType === 'list') return item.type === 'text';
        return true;
    });

    // 페이지네이션 계산
    const totalPages = Math.max(1, Math.ceil(filteredList.length / POSTS_PER_PAGE));
    const pagedList = filteredList.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    // 페이지 변경 시 범위 초과 방지
    const safeSetPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // 설문 퍼센트 계산 헬퍼
    const getPercent = (votes, idx, total) => {
        if (!total) return 0;
        return Math.round((Number(votes[idx] || 0) / total) * 100);
    };

    return (
        <div className="list-container">

            {/* ── 상단: 설문 요약 섹션 ── */}
            {surveyItems.length > 0 && (
                <div className="survey-top-section">
                    {surveyItems.map((item) => {
                        // subject는 '^' 구분자 또는 JSON 배열 모두 지원
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
                                <p className="survey-total">총 {total}표</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── 검색창 ── */}
            <div className="search-section">
                <BoardForm onSearch={(kw) => { onSearch(kw); setCurrentPage(1); }} />
            </div>

            {/* ── 뷰타입 + 게시글 수 ── */}
            <div className="list-controls">
                <span className="list-count">📋 게시글 ({filteredList.length})</span>
                <div className="view-type-buttons">
                    <button
                        className={viewType === 'card' ? 'active' : ''}
                        onClick={() => { setViewType('card'); setCurrentPage(1); }}
                    >🖼 이미지형</button>
                    <button
                        className={viewType === 'list' ? 'active' : ''}
                        onClick={() => { setViewType('list'); setCurrentPage(1); }}
                    >☰ 목록형</button>
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
                                    {/* 북마크 버튼 */}
                                    <span
                                        className="bookmark-btn"
                                        title="북마크"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onBookmark(item._id);
                                        }}
                                    >
                                        {item.isBookmarked ? '⭐' : '☆'}
                                    </span>
                                </div>
                                {item.region && (
                                    <span className="tag">#{item.region}</span>
                                )}
                                <p className="card-meta">
                                    👤 {item.userId}
                                    {viewType === 'list' && (
                                        <span className="card-date">
                                            {new Date(item.sysdate).toLocaleDateString()}
                                        </span>
                                    )}
                                    &nbsp;|&nbsp; 👀 {item.readCount || 0}
                                </p>
                            </div>
                            {viewType === 'list' && (
                                <button className="btn-view" onClick={(e) => { e.stopPropagation(); onDetail(item); }}>
                                    보기
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ── 페이지네이션 ── */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => safeSetPage(1)} disabled={currentPage === 1}>«</button>
                    <button onClick={() => safeSetPage(currentPage - 1)} disabled={currentPage === 1}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                        <button
                            key={num}
                            className={currentPage === num ? 'active' : ''}
                            onClick={() => safeSetPage(num)}
                        >{num}</button>
                    ))}
                    <button onClick={() => safeSetPage(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
                    <button onClick={() => safeSetPage(totalPages)} disabled={currentPage === totalPages}>»</button>
                </div>
            )}
        </div>
    );
};

export default BoardList;
