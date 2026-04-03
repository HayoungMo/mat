import React, { useEffect, useState, useCallback } from 'react';
import BoardService from './BoardService';
import {
    MdEdit, MdDelete, MdArrowBack, MdPushPin, MdPerson,
    MdCalendarToday, MdSync, MdStar, MdStarBorder,
    MdHowToVote, MdLock, MdHistoryEdu, MdVisibility,
    MdAccessTime, MdComment, MdSend
} from "react-icons/md";

const BoardItem = ({ item, onBack, onEdit, onDelete, onBookmark, loginUser, viewType, onVoteSuccess }) => {
    const [detail, setDetail] = useState(item);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [relatedPosts, setRelatedPosts] = useState({ prev: [], next: [] });
    const [hasVotedThisSession, setHasVotedThisSession] = useState(false);

    // ⏰ 타이머 및 긴급 상태
    const [timeLeft, setTimeLeft] = useState("");
    const [isUrgent, setIsUrgent] = useState(false);

    // 💬 댓글 관련 상태
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    // ✅ loginUser가 객체일 경우를 대비해 ID 문자열 추출
    const currentUserId = loginUser?.userId || loginUser?.id || (typeof loginUser === 'string' ? loginUser : null);

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
    }, [detail?._id, detail?.type]);

    // ⏰ 3. 실시간 카운트다운 (설문 전용)
    useEffect(() => {
        if (!detail?.sysdate || detail.type !== 'survey') return;
        const timer = setInterval(() => {
            const now = new Date();
            const writeDate = new Date(detail.sysdate);
            const limitDate = new Date(writeDate.getTime() + 3 * 24 * 60 * 60 * 1000);
            const diff = limitDate - now;

            if (diff <= 0) {
                setTimeLeft("투표가 마감되었습니다.");
                setIsUrgent(false);
                clearInterval(timer);
            } else {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);
                setIsUrgent(diff < 1000 * 60 * 60);
                if (d > 0) {
                    setTimeLeft(`${d}일 ${h}시간 ${m}분 ${s}초 남음`);
                } else {
                    setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} 남음`);
                }
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [detail?.sysdate, detail?.type]);

    // 💬 4. 댓글 로드 (text/image 타입만)
    useEffect(() => {
        if (!detail?._id) return;
        if (detail.type === 'survey') return;
        setCommentLoading(true);
        BoardService.getComments(detail._id)
            .then(data => setComments(Array.isArray(data) ? data : []))
            .catch(err => console.error('댓글 로드 실패', err))
            .finally(() => setCommentLoading(false));
    }, [detail?._id, detail?.type]);

    // ---------------------------------------------------------
    // 데이터 파싱
    // ---------------------------------------------------------
    let options = [];
    let displayContent = detail?.subject || '';
    let displayStyle = { fontFamily: 'Pretendard', textAlign: 'left', fontWeight: '400' };

    if (detail?.type === 'survey') {
        try {
            options = typeof detail.subject === 'string' ? JSON.parse(detail.subject) : detail.subject;
        } catch {
            options = (detail.subject || '').split('^').filter(Boolean);
        }
    } else {
        try {
            const parsed = JSON.parse(detail.subject);
            if (parsed && typeof parsed === 'object' && parsed.content !== undefined) {
                displayContent = parsed.content;
                displayStyle = {
                    fontFamily: parsed.font || 'Pretendard',
                    textAlign: parsed.align || 'left',
                    fontWeight: parsed.weight || '400'
                };
            }
        } catch (e) {
            displayContent = detail.subject;
        }
    }

    const votes = detail?.votedCount || options.map(() => 0);
    const totalVotes = votes.reduce((a, b) => Number(a) + Number(b), 0);
    const getPercent = (count) => (totalVotes === 0 ? 0 : Math.round((Number(count) / totalVotes) * 100));
    
    // ✅ 투표 여부 확인 (userId 문자열로 비교)
    const isAlreadyVoted = (detail?.voters && detail.voters.includes(currentUserId)) || hasVotedThisSession;

    // 투표 핸들러
    const handleVote = async (index) => {
        if (!currentUserId) { alert("로그인 후 투표에 참여해주세요! 😊"); return; }
        if (isAlreadyVoted) { alert("이미 이 설문에 참여하셨습니다! 🙏"); return; }
        if (timeLeft === "투표가 마감되었습니다.") { alert("마감된 투표에는 참여할 수 없습니다."); return; }
        try {
            // ✅ BoardService.updateVote에 currentUserId를 세 번째 인자로 확실히 전달
            await BoardService.updateVote(detail._id, index, currentUserId);
            setHasVotedThisSession(true);
            const updated = await BoardService.getDetail(detail._id);
            if (updated) setDetail(updated);
            alert("투표가 완료되었습니다! ✨");
            if (onVoteSuccess) onVoteSuccess();
        } catch (e) { 
            console.error(e);
            alert("투표 처리 중 오류가 발생했습니다."); 
        }
    };

    // 북마크 핸들러
    const isMyBookmark = Boolean(currentUserId && Array.isArray(detail?.isBookmarked) && detail.isBookmarked.some(id => String(id) === String(currentUserId)));
    const handleBookmarkClick = async () => {
        if (!currentUserId) { alert("로그인이 필요한 서비스입니다. 😊"); return; }
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            // ✅ 부모(Board.js)에서 내려온 onBookmark 함수에 ID 전달
            await onBookmark(detail._id, currentUserId);
            const updated = await BoardService.getDetail(detail._id);
            if (updated) setDetail(updated);
        } finally { setIsUpdating(false); }
    };

    // 💬 댓글 등록
    const handleCommentSubmit = async () => {
        if (!currentUserId) { alert("로그인이 필요한 서비스입니다. 😊"); return; }
        if (!commentText.trim()) { alert("댓글 내용을 입력해주세요."); return; }
        setCommentSubmitting(true);
        try {
            await BoardService.addComment(detail._id, { userId: currentUserId, content: commentText.trim() });
            setCommentText('');
            const updated = await BoardService.getComments(detail._id);
            setComments(Array.isArray(updated) ? updated : []);
        } catch (e) {
            alert("댓글 등록에 실패했습니다.");
            console.error(e);
        } finally {
            setCommentSubmitting(false);
        }
    };

    // 💬 댓글 삭제
    const handleCommentDelete = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
        try {
            await BoardService.deleteComment(detail._id, commentId, currentUserId);
            const updated = await BoardService.getComments(detail._id);
            setComments(Array.isArray(updated) ? updated : []);
        } catch (e) {
            alert("댓글 삭제에 실패했습니다.");
        }
    };

    const renderCard = (post, label) => (
        <div key={post._id} onClick={() => { setDetail(post); window.scrollTo(0, 0); }} style={{ flex: 1, cursor: 'pointer', border: '1px solid #eee', borderRadius: '8px', padding: '12px', background: '#fff' }}>
            <span style={{ fontSize: '11px', color: '#8a2130', fontWeight: 'bold' }}>{label} 게시글</span>
            <div style={{ fontSize: '14px', fontWeight: 'bold', margin: '5px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
            <div style={{ fontSize: '12px', color: '#093c71', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MdPerson size={14} /> {post.userId} | <MdCalendarToday size={12} /> {new Date(post.sysdate).toLocaleDateString()}
            </div>
        </div>
    );

    if (loadingDetail) return <div className="loading"><MdSync className="spin" /> 불러오는 중...</div>;
    if (!detail) return <div className="loading">게시글을 찾을 수 없습니다.</div>;

    return (
        <div className="detail-container">
            <div className="breadcrumb" style={{ fontSize: '13px', color: '#6a87aa', marginBottom: '12px' }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }}>게시판</span> /
                <span onClick={onBack} style={{ cursor: 'pointer', marginLeft: '8px' }}>{viewType === 'card' ? '이미지형' : '목록형'}</span> /
                <span style={{ fontWeight: 'bold', color: '#093c71', marginLeft: '8px' }}>상세보기</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className={`detail-type-badge ${detail.type}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {detail.type === 'survey' ? <><MdHowToVote /> 설문</> : <><MdHistoryEdu /> {detail.type}</>}
                </span>
                <span onClick={handleBookmarkClick} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '25px', fontSize: '1.2rem', fontWeight: 'bold', background: isMyBookmark ? '#fff0f0' : '#f5f5f5', border: `1px solid ${isMyBookmark ? '#f5f5f5' : '#e0e0e0'}`, color: isMyBookmark ? '#8a2130' : '#aaa' }}>
                    {isMyBookmark ? <MdStar style={{ fontSize: '1.8rem', color: '#ffca28' }} /> : <MdStarBorder style={{ fontSize: '1.8rem', color: '#ccc' }} />}
                    <span>{detail.isBookmarked?.length || 0}</span>
                </span>
            </div>

            <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <p className="detail-info" style={{ color: '#093c71', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', margin: 0, fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MdPerson /> {detail.userId}</span> |
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MdVisibility /> {detail.readCount || 0}</span> |
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MdCalendarToday /> {new Date(detail.sysdate).toLocaleString()}</span>
                </p>
            </div>

            <div className="detail-body" style={{ minHeight: '300px', padding: '20px 0' }}>
                {detail.type === 'survey' ? (
                    <div className="survey-vote-container" style={{ background: '#f9f9f9', padding: '30px', borderRadius: '15px', border: '1px dashed #ddd' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '15px', color: isUrgent ? '#ff4d4f' : '#8a2130', fontWeight: 'bold', fontSize: '15px' }}>
                            <MdAccessTime size={20} className={isUrgent ? "pulse-animation" : ""} />
                            <span>{timeLeft}</span>
                        </div>

                        <h3 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {currentUserId ? (isAlreadyVoted ? <><MdHowToVote color="#666" /> 투표 결과</> : <><MdHowToVote color="#8a2130" /> 투표하세요!</>) : <><MdLock color="#666" /> 로그인 필요</>}
                        </h3>
                        {options.map((opt, idx) => (
                            <div key={idx} onClick={() => handleVote(idx)} className={`survey-option-item ${currentUserId && !isAlreadyVoted ? 'active' : 'disabled'}`} style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '12px', marginBottom: '15px', cursor: (currentUserId && !isAlreadyVoted) ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '15px', opacity: (isAlreadyVoted || timeLeft.includes("마감")) ? 0.7 : 1 }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #8a2130', background: (currentUserId && !isAlreadyVoted) ? '#fff' : '#f0f0f0', flexShrink: 0 }}></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '15px' }}>
                                        <span style={{ fontWeight: '500' }}>{opt}</span>
                                        <span style={{ fontWeight: 'bold', color: '#8a2130' }}>{getPercent(votes[idx])}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '10px', background: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ width: `${getPercent(votes[idx])}%`, height: '100%', background: '#e6c2c9', transition: 'width 0.5s ease' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {detail.type === 'image' && detail.saveFileName && (
                            <div className="image-box" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                                <img src={`/uploads/${detail.saveFileName}`} alt="맛집 사진" style={{ maxWidth: '40%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </div>
                        )}
                        <div
                            className="detail-subject"
                            style={{
                                whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '16px',
                                fontFamily: displayStyle.fontFamily,
                                textAlign: displayStyle.textAlign,
                                fontWeight: displayStyle.fontWeight
                            }}
                        >
                            {displayContent}
                        </div>
                    </>
                )}
            </div>

            <div className="detail-footer" style={{ marginTop: '50px', textAlign: 'center' }}>
                <button className="btn-back" onClick={onBack} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                    <MdArrowBack style={{ marginRight: '5px' }} /> 목록
                </button>
                {currentUserId && detail.userId === currentUserId && (
                    <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                        <button className="btn-edit" onClick={onEdit} style={{ padding: '10px 20px', backgroundColor: '#8a2130', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>수정</button>
                        <button className="btn-delete" onClick={() => onDelete(detail._id)} style={{ padding: '10px 20px', backgroundColor: '#093c71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>삭제</button>
                    </div>
                )}
            </div>

            {/* 댓글 섹션 */}
            {(detail.type === 'text' || detail.type === 'image') && (
                <div className="comment-section">
                    <h4 className="comment-title">
                        <MdComment size={18} />
                        댓글 <span className="comment-count">{comments.length}</span>
                    </h4>

                    <div className="comment-input-wrap">
                        <span className="comment-author-badge">
                            <MdPerson size={14} />
                            {currentUserId || '비로그인'}
                        </span>
                        <textarea
                            className="comment-textarea"
                            placeholder={currentUserId ? "댓글을 입력하세요..." : "로그인 후 댓글을 남길 수 있습니다."}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={!currentUserId || commentSubmitting}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommentSubmit();
                                }
                            }}
                        />
                        <button
                            className="comment-submit-btn"
                            onClick={handleCommentSubmit}
                            disabled={!currentUserId || commentSubmitting || !commentText.trim()}
                        >
                            <MdSend size={16} />
                            {commentSubmitting ? '등록 중...' : '등록'}
                        </button>
                    </div>

                    {commentLoading ? (
                        <div className="comment-loading">댓글 불러오는 중...</div>
                    ) : comments.length === 0 ? (
                        <div className="comment-empty">첫 번째 댓글을 남겨보세요! 💬</div>
                    ) : (
                        <ul className="comment-list">
                            {comments.map((c) => (
                                <li key={c._id} className="comment-item">
                                    <div className="comment-item-header">
                                        <span className="comment-item-user">
                                            <MdPerson size={14} /> {c.userId}
                                        </span>
                                        <span className="comment-item-date">
                                            {new Date(c.createdAt).toLocaleString()}
                                        </span>
                                        {currentUserId === c.userId && (
                                            <button
                                                className="comment-delete-btn"
                                                onClick={() => handleCommentDelete(c._id)}
                                            >
                                                <MdDelete size={14} /> 삭제
                                            </button>
                                        )}
                                    </div>
                                    <p className="comment-item-content">{c.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <hr className="detail-divider" />
            <div className="related-section" style={{ marginTop: '40px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '20px', color: '#8a2130' }}><MdPushPin /> 게시글 더보기</h4>
                {relatedPosts.next.length > 0 && <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>{relatedPosts.next.map(post => renderCard(post, '다음'))}</div>}
                {relatedPosts.prev.length > 0 && <div style={{ display: 'flex', gap: '15px' }}>{relatedPosts.prev.map(post => renderCard(post, '이전'))}</div>}
            </div>
        </div>
    );
};

export default BoardItem;