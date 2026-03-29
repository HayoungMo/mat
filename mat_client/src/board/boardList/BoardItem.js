import React, { useState, useEffect } from 'react';
import BoardService from './BoardService';

const BoardItem = ({ item, onBack, onEdit, onDelete, onBookmark, loginUser, viewType, onVoteSuccess }) => {
    const [detail, setDetail] = useState(item);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [relatedPosts, setRelatedPosts] = useState({ prev: [], next: [] });

    // 1. 상세 데이터 로드
    useEffect(() => {
        if (!item?._id) return;
        setLoadingDetail(true);
        BoardService.getDetail(item._id)
            .then(data => { if (data) setDetail(data); })
            .catch(err => console.error('상세 조회 실패', err))
            .finally(() => setLoadingDetail(false));
    }, [item?._id]);

    // 2. 연관 게시글 추출
    useEffect(() => {
        if (!detail?._id) return;
        BoardService.getMatList().then(data => {
            if (!Array.isArray(data)) return;
            const sameTypePosts = data
                .filter(p => p.type === detail.type)
                .sort((a, b) => new Date(a.sysdate) - new Date(b.sysdate));
            const currentIndex = sameTypePosts.findIndex(p => p._id === detail._id);
            setRelatedPosts({
                prev: sameTypePosts.slice(Math.max(0, currentIndex - 2), currentIndex),
                next: sameTypePosts.slice(currentIndex + 1, currentIndex + 3)
            });
        });
    }, [detail]);

    // ✅ 설문 파싱
    let options = [];
    if (detail?.type === 'survey') {
        try {
            options = typeof detail.subject === 'string' ? JSON.parse(detail.subject) : detail.subject;
        } catch {
            options = (detail.subject || '').split('^').filter(Boolean);
        }
    }
    const votes = detail?.votedCount || options.map(() => 0);
    const totalVotes = votes.reduce((a, b) => Number(a) + Number(b), 0);
    const getPercent = (count) => (totalVotes === 0 ? 0 : Math.round((Number(count) / totalVotes) * 100));

    // ✅ 투표 핸들러
    const handleVote = async (index) => {
        if (!loginUser) {
            alert("로그인 후 투표에 참여해주세요! 😊");
            return;
        }
        try {
            await BoardService.updateVote(detail._id, index);
            const updated = await BoardService.getDetail(detail._id);
            if (updated) setDetail(updated);
            if (onVoteSuccess) onVoteSuccess();
        } catch (e) {
            alert("투표 처리 중 오류가 발생했습니다.");
        }
    };

    const isMyBookmark = Boolean(
        loginUser && 
        Array.isArray(detail?.isBookmarked) && 
        detail.isBookmarked.some(id => String(id) === String(loginUser))
    );

    const handleBookmarkClick = async () => {
        if (!loginUser) {
            alert("로그인이 필요한 서비스입니다. 로그인 후 이용해주세요! 😊");
            return;
        }
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            await onBookmark(detail._id);
            const updated = await BoardService.getDetail(detail._id);
            if (updated) setDetail(updated);
        } catch (e) {
            console.error("북마크 처리 중 오류", e);
        } finally {
            setIsUpdating(false);
        }
    };

    const renderCard = (post, label) => (
        <div 
            key={post._id} 
            onClick={() => { setDetail(post); window.scrollTo(0,0); }}
            style={{ flex: 1, cursor: 'pointer', border: '1px solid #eee', borderRadius: '8px', padding: '12px', background: '#fff' }}
        >
            <span style={{ fontSize: '11px', color: label === '이전' ? '#999' : '#5a9367', fontWeight: 'bold' }}>{label} 게시글</span>
            <div style={{ fontSize: '14px', fontWeight: 'bold', margin: '5px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>👤 {post.userId} | 📅 {new Date(post.sysdate).toLocaleDateString()}</div>
        </div>
    );

    if (loadingDetail) return <div className="loading">🔄 불러오는 중...</div>;
    if (!detail) return <div className="loading">게시글을 찾을 수 없습니다.</div>;

    return (
        <div className="detail-container">
            <div className="breadcrumb" style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }}>게시판</span> / 
                <span onClick={onBack} style={{ cursor: 'pointer', marginLeft: '8px' }}>{viewType === 'card' ? '이미지형' : '목록형'}</span> / 
                <span style={{ fontWeight: 'bold', color: '#333', marginLeft: '8px' }}>상세보기</span>
            </div>

            <div className="detail-header">
                <span className={`detail-type-badge ${detail.type}`}>[{detail.type === 'survey' ? '📊 설문' : detail.type}]</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                    <h2 className="detail-title" style={{ flex: 1 }}>{detail.title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span onClick={handleBookmarkClick} style={{ cursor: 'pointer', fontSize: '1.6rem' }}>{isMyBookmark ? '⭐' : '☆'}</span>
                        <span style={{ fontSize: '1.2rem', color: '#FF6B6B', fontWeight: 'bold' }}>{detail.isBookmarked?.length || 0}</span>
                    </div>
                </div>
                <p className="detail-info" style={{ color: '#888' }}>👤 {detail.userId} | 👀 {detail.readCount || 0} | 📅 {new Date(detail.sysdate).toLocaleString()}</p>
            </div>

            <hr className="detail-divider" />

            <div className="detail-body" style={{ minHeight: '300px', padding: '20px 0' }}>
                {detail.type === 'survey' ? (
                    <div className="survey-vote-container" style={{ background: '#f9f9f9', padding: '30px', borderRadius: '15px', border: '1px dashed #ddd' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'center' }}>
                            {loginUser ? "🗳️ 원하시는 항목을 클릭하여 투표하세요!" : "🔒 투표를 위해 로그인이 필요합니다."}
                        </h3>
                        
                        {options.map((opt, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleVote(idx)} 
                                className={`survey-option-item ${loginUser ? 'active' : 'disabled'}`}
                                style={{ 
                                    background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '12px', 
                                    marginBottom: '15px', cursor: loginUser ? 'pointer' : 'default',
                                    display: 'flex', alignItems: 'center', gap: '15px', transition: 'all 0.2s'
                                }}
                            >
                                {/* ✅ 체크박스 원형 아이콘 추가 */}
                                <div style={{ 
                                    width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #ff6b6b', 
                                    background: loginUser ? '#fff' : '#f0f0f0', flexShrink: 0 
                                }}></div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '15px' }}>
                                        <span style={{ fontWeight: '500' }}>{opt}</span>
                                        <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{getPercent(votes[idx])}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '10px', background: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ width: `${getPercent(votes[idx])}%`, height: '100%', background: '#ff6b6b', transition: 'width 0.5s ease' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <p style={{ textAlign: 'center', fontSize: '13px', color: '#999', marginTop: '15px' }}>총 {totalVotes}명이 투표했습니다.</p>
                    </div>
                ) : (
                    <>
                        {detail.type === 'image' && detail.saveFileName && (
                            <div className="image-box" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                                <img src={`http://localhost:4000/uploads/${detail.saveFileName}`} alt="맛집 사진" style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </div>
                        )}
                        <div className="detail-subject" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '16px' }}>{detail.subject}</div>
                    </>
                )}
            </div>

            <div className="detail-footer" style={{ marginTop: '50px', textAlign: 'center' }}>
                <button className="btn-back" onClick={onBack} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← 목록</button>
                {loginUser && detail.userId === loginUser && (
                    <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                        <button className="btn-edit" onClick={onEdit} style={{ padding: '10px 20px', backgroundColor: '#5a9367', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>✏️ 수정</button>
                        <button className="btn-delete" onClick={() => onDelete(detail._id)} style={{ padding: '10px 20px', backgroundColor: '#e57373', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🗑 삭제</button>
                    </div>
                )}
            </div>

            <hr className="detail-divider" />
            <div className="related-section" style={{ marginTop: '40px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '20px', color: '#333' }}>📌 게시글 더보기</h4>
                {relatedPosts.next.length > 0 && <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>{relatedPosts.next.map(post => renderCard(post, '다음'))}</div>}
                {relatedPosts.prev.length > 0 && <div style={{ display: 'flex', gap: '15px' }}>{relatedPosts.prev.map(post => renderCard(post, '이전'))}</div>}
            </div>
        </div>
    );
};

export default BoardItem;