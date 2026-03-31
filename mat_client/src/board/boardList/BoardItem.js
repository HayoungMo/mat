import React, { useState, useEffect } from 'react';
import BoardService from './BoardService';
import { 
    MdEdit, MdDelete, MdArrowBack, MdPushPin, MdPerson, 
    MdCalendarToday, MdSync, MdStar, MdStarBorder, 
    MdHowToVote, MdLock, MdHistoryEdu, MdVisibility 
} from "react-icons/md";

const BoardItem = ({ item, onBack, onEdit, onDelete, onBookmark, loginUser, viewType, onVoteSuccess }) => {
    const [detail, setDetail] = useState(item);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [relatedPosts, setRelatedPosts] = useState({ prev: [], next: [] });
    const [hasVotedThisSession, setHasVotedThisSession] = useState(false);
    
    // 1. 상세 데이터 로드 (최신 상태 동기화)
    useEffect(() => {
        if (!item?._id) return;
        setLoadingDetail(true);
        BoardService.getDetail(item._id)
            .then(data => { if (data) setDetail(data); })
            .catch(err => console.error('상세 조회 실패', err))
            .finally(() => setLoadingDetail(false));
    }, [item?._id]);

    // 2. 연관 게시글 추출 (이전글 2개, 다음글 2개)
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

    // ✅ 설문 데이터 파싱 및 투표 정보 계산
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

    // ✅ 중복 투표 여부 확인 (서버의 voters 배열 또는 현재 세션 기록)
    const isAlreadyVoted = (detail?.voters && detail.voters.includes(loginUser)) || hasVotedThisSession;

    // ✅ 투표하기 핸들러
    const handleVote = async (index) => {
        if (!loginUser) {
            alert("로그인 후 투표에 참여해주세요! 😊");
            return;
        }
        
        if (isAlreadyVoted) {
            alert("이미 이 설문에 참여하셨습니다! 🙏");
            return;
        }

        try {
            // 서버에 투표 요청 (id, 선택인덱스, 유저id 전달)
            await BoardService.updateVote(detail._id, index, loginUser);
            
            setHasVotedThisSession(true); // 프론트 즉시 차단

            // 투표 후 최신 데이터를 다시 가져와서 화면 갱신
            const updated = await BoardService.getDetail(detail._id);
            if (updated) setDetail(updated);
            
            alert("투표가 완료되었습니다! ✨");
            if (onVoteSuccess) onVoteSuccess();
        } catch (e) {
            console.error("투표 오류:", e);
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
            {/* 상단 브레드크럼 */}
            <div className="breadcrumb" style={{ fontSize: '13px', color: '#6a87aa', marginBottom: '12px' }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }}>게시판</span> / 
                <span onClick={onBack} style={{ cursor: 'pointer', marginLeft: '8px' }}>{viewType === 'card' ? '이미지형' : '목록형'}</span> / 
                <span style={{ fontWeight: 'bold', color: '#093c71', marginLeft: '8px' }}>상세보기</span>
            </div>

            {/* 타입 배지 및 북마크 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className={`detail-type-badge ${detail.type}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {detail.type === 'survey' ? <><MdHowToVote /> 설문</> : <><MdHistoryEdu /> {detail.type}</>}
                </span>

                <span
                    onClick={handleBookmarkClick}
                    style={{
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 12px',
                        borderRadius: '25px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        background: isMyBookmark ? '#fff0f0' : '#f5f5f5',
                        border: `1px solid ${isMyBookmark ? '#f5f5f5' : '#e0e0e0'}`,
                        color: isMyBookmark ? '#8a2130' : '#aaa',
                    }}
                >
                    {isMyBookmark ? <MdStar style={{ fontSize: '1.8rem', color: '#ffca28' }} /> : <MdStarBorder style={{ fontSize: '1.8rem', color: '#ccc' }} />}
                    <span>{detail.isBookmarked?.length || 0}</span>
                </span>
            </div>

            {/* 작성 정보 */}
            <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <p className="detail-info" style={{ color: '#093c71', display: 'flex', alignItems: 'center', gap: '8px',justifyContent: 'flex-end' ,margin: 0, fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MdPerson /> {detail.userId}</span> | 
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MdVisibility /> {detail.readCount || 0}</span> | 
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MdCalendarToday /> {new Date(detail.sysdate).toLocaleString()}</span>
                </p>
            </div>

            {/* 본문 (설문 또는 일반글) */}
            <div className="detail-body" style={{ minHeight: '300px', padding: '20px 0' }}>
                {detail.type === 'survey' ? (
                    <div className="survey-vote-container" style={{ background: '#f9f9f9', padding: '30px', borderRadius: '15px', border: '1px dashed #ddd' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {loginUser ? (
                                isAlreadyVoted ? <><MdHowToVote style={{ color: '#666' }} /> 투표 결과입니다.</> : <><MdHowToVote style={{ color: '#8a2130' }} /> 원하시는 항목을 클릭하여 투표하세요!</>
                            ) : (
                                <><MdLock style={{ color: '#666' }} /> 투표를 위해 로그인이 필요합니다.</>
                            )}
                        </h3>
                        
                        {options.map((opt, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleVote(idx)} 
                                className={`survey-option-item ${loginUser && !isAlreadyVoted ? 'active' : 'disabled'}`}
                                style={{ 
                                    background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '12px', 
                                    marginBottom: '15px', 
                                    cursor: (loginUser && !isAlreadyVoted) ? 'pointer' : 'default',
                                    display: 'flex', alignItems: 'center', gap: '15px', transition: 'all 0.2s',
                                    opacity: isAlreadyVoted ? 0.7 : 1 // ✅ 투표 완료 시 흐리게
                                }}
                            >
                                <div style={{ 
                                    width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #8a2130', 
                                    background: (loginUser && !isAlreadyVoted) ? '#fff' : '#f0f0f0', flexShrink: 0 
                                }}></div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '15px' }}>
                                        <span style={{ fontWeight: '500' }}>{opt}</span>
                                        <span style={{ fontWeight: 'bold', color: '#8a2130' }}>{getPercent(votes[idx])}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '10px', background: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ width: `${getPercent(votes[idx])}%`, height: '100%', background: '#e6c2c9' , transition: 'width 0.5s ease' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <p style={{ textAlign: 'center', fontSize: '13px', color: '#093c71', marginTop: '15px' }}>총 {totalVotes}명이 투표했습니다.</p>
                    </div>
                ) : (
                    <>
                        {detail.type === 'image' && detail.saveFileName && (
                            <div className="image-box" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                                <img src={`/uploads/${detail.saveFileName}`} alt="맛집 사진" style={{ maxWidth: '40%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </div>
                        )}
                        <div className="detail-subject" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '16px' }}>{detail.subject}</div>
                    </>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="detail-footer" style={{ marginTop: '50px', textAlign: 'center' }}>
                <button className="btn-back" onClick={onBack} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                    <MdArrowBack style={{ marginRight: '5px' }} /> 목록
                </button>
                
                {loginUser && detail.userId === loginUser && (
                    <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                        <button className="btn-edit" onClick={onEdit} style={{ padding: '10px 20px', backgroundColor: '#8a2130', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px', display: 'inline-flex', alignItems: 'center' }}>
                            <MdEdit style={{ marginRight: '5px' }} /> 수정
                        </button>
                        <button className="btn-delete" onClick={() => onDelete(detail._id)} style={{ padding: '10px 20px', backgroundColor: '#093c71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                            <MdDelete style={{ marginRight: '5px' }} /> 삭제
                        </button>
                    </div>
                )}
            </div>

            <hr className="detail-divider" />
            <div className="related-section" style={{ marginTop: '40px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '20px', color: '#8a2130', display: 'flex', alignItems: 'center' }}>
                    <MdPushPin style={{ marginRight: '5px', color: '#8a2130', transform: 'rotate(45deg)' }} /> 게시글 더보기
                </h4>
                {relatedPosts.next.length > 0 && <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>{relatedPosts.next.map(post => renderCard(post, '다음'))}</div>}
                {relatedPosts.prev.length > 0 && <div style={{ display: 'flex', gap: '15px' }}>{relatedPosts.prev.map(post => renderCard(post, '이전'))}</div>}
            </div>
        </div>
    );
};

export default BoardItem;