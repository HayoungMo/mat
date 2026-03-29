import React, { useState, useEffect } from 'react';
import BoardService from './BoardService';

const BoardItem = ({ item, onBack, onEdit, onDelete, onVoteSuccess, onBookmark, loginUser }) => {
    const [detail, setDetail] = useState(item);
    const [selectedOption, setSelectedOption] = useState('');
    const [isVoted, setIsVoted] = useState(false);
    const [localVotes, setLocalVotes] = useState([]);

    useEffect(() => {
        if (item?._id) {
            BoardService.getDetail(item._id)
                .then(data => { if (data) setDetail(data); })
                .catch(err => console.error('상세 조회 실패', err));
        }
    }, [item?._id]);

    const parseOptions = (subject) => {
        if (!subject) return [];
        try {
            const parsed = JSON.parse(subject);
            if (Array.isArray(parsed)) return parsed;
        } catch {}
        return subject.split('^').filter(Boolean);
    };

    const options = detail?.type === 'survey' ? parseOptions(detail.subject) : [];

    useEffect(() => {
        if (detail && detail.type === 'survey') {
            const initial = detail.votedCount?.length > 0
                ? detail.votedCount.map(v => Number(v) || 0)
                : options.map(() => 0);
            setLocalVotes(initial);
            setIsVoted(false);
            setSelectedOption('');
        }
    }, [detail]);

    // ✅ 내 북마크 여부 판단 (배열 체크)
    const isMyBookmark = detail.isBookmarked && Array.isArray(detail.isBookmarked) 
                         ? detail.isBookmarked.includes(loginUser) 
                         : false;

    // ✅ 북마크 클릭 핸들러: 실행 후 데이터를 다시 가져와서 별 색깔을 즉시 변경
    const handleBookmark = async () => {
        await onBookmark(detail._id); // 부모(Board.js)의 북마크 함수 호출
        const updatedData = await BoardService.getDetail(detail._id); // 최신 데이터 다시 가져오기
        if (updatedData) setDetail(updatedData);
    };

    const totalVotes = localVotes.reduce((a, b) => a + b, 0);

    const handleVote = async () => {
        if (!selectedOption) return alert("항목을 선택해 주세요!");
        const idx = options.indexOf(selectedOption);
        try {
            await BoardService.updateVote(detail._id, idx);
            const updated = [...localVotes];
            updated[idx] = (updated[idx] || 0) + 1;
            setLocalVotes(updated);
            setIsVoted(true);
            onVoteSuccess?.();
        } catch (e) {
            alert("투표 실패");
        }
    };

    if (!detail) return <div className="loading">로딩 중...</div>;

    return (
        <div className="detail-container">
            <div className="detail-header">
                <span className="detail-type-badge">[{detail.type?.toUpperCase()}]</span>
                <h2 className="detail-title">{detail.title}</h2>
                <span 
                    className="detail-bookmark-btn" 
                    onClick={handleBookmark} 
                    style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '1.2rem' }}
                >
                   
                    {isMyBookmark ? '⭐' : '☆'}
                </span>
                <p className="detail-info">
                    👤 {detail.userId}
                    &nbsp;|&nbsp;
                    📅 {detail.sysdate ? new Date(detail.sysdate).toLocaleDateString() : ''}
                    &nbsp;|&nbsp;
                    👀 {detail.readCount || 0}
                    {detail.originalFileName && (
                        <>&nbsp;|&nbsp; 📎 {detail.originalFileName}</>
                    )}
                </p>
            </div>

            <hr className="detail-divider" />

            <div className="detail-body">
                {detail.type === 'image' && detail.saveFileName && (
                    <div className="image-box">
                        <img
                            src={`http://localhost:4000/uploads/${detail.saveFileName}`}
                            alt="첨부 이미지"
                            className="detail-image"
                        />
                    </div>
                )}

                {detail.type === 'survey' ? (
                    <div className="survey-detail">
                        <p className="survey-prompt">📊 아래 항목 중 선택해 주세요</p>
                        {isVoted ? (
                            <div className="survey-results">
                                {options.map((opt, i) => {
                                    const pct = totalVotes
                                        ? Math.round((localVotes[i] / totalVotes) * 100)
                                        : 0;
                                    return (
                                        <div key={i} className="result-row">
                                            <div className="result-label">
                                                <span>{opt}</span>
                                                <span>{pct}% ({localVotes[i]}표)</span>
                                            </div>
                                            <div className="result-bar-bg">
                                                <div className="result-bar-fill" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                <p className="survey-total-votes">총 {totalVotes}표</p>
                            </div>
                        ) : (
                            <div className="survey-options">
                                {options.map((opt, i) => (
                                    <label key={i} className="survey-option-label">
                                        <input
                                            type="radio"
                                            name="survey-opt"
                                            value={opt}
                                            checked={selectedOption === opt}
                                            onChange={() => setSelectedOption(opt)}
                                        />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                                <button
                                    className="btn-vote"
                                    onClick={handleVote}
                                    disabled={!selectedOption}
                                >
                                    ✅ 투표하기
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="detail-subject">{detail.subject}</div>
                )}
            </div>

            <div className="detail-footer">
                <button className="btn-back" onClick={onBack}>← 목록</button>
                <button className="btn-edit" onClick={onEdit}>✏️ 수정</button>
                <button className="btn-delete" onClick={() => onDelete(detail._id)}>🗑 삭제</button>
            </div>
        </div>
    );
};

export default BoardItem;