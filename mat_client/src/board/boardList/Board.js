import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardList from './BoardList';
import BoardWrite from './BoardWrite';
import BoardItem from './BoardItem';
import BoardEdit from './BoardEdit';
import BoardService from './BoardService';
import './Board.css';

const Board = ({ loginUser }) => {
    const [view, setView] = useState('list');
    const [matList, setMatList] = useState([]);
    const [selected, setSelected] = useState(null);
    const [viewType, setViewType] = useState('card');
    const navigate = useNavigate();

    const fetchList = useCallback(async (keyword = "") => {
        try {
            const data = await BoardService.getMatList(keyword);
            // isHidden 필터링 (숨김 처리된 글 제외)
            setMatList(data.filter(item => !item.isHidden));
        } catch (e) {
            console.error("데이터 로드 실패", e);
        }
    }, []);

    useEffect(() => { fetchList(); }, [fetchList]);

    // 북마크 토글
    // Board.js 내부의 onBookmark 함수

        const onBookmark = async (id) => {
            // [추가] 로그인 체크: 이게 없으면 서버 통신 전에 막을 수 없어
            if (!loginUser) {
                alert("로그인한 사용자만 북마크를 이용할 수 있습니다.");
                return;
            }

            try {
                const res = await BoardService.updateBookmark(id);
                
                // 목록 새로고침 (이게 돌아야 DB 상태가 반영된 ⭐ 노란 별이 보임)
                fetchList();

                const isBookmarked = res.data?.isBookmarked;
                if (isBookmarked) {
                    console.log("북마크 추가됨");
                    // alert("⭐ 북마크에 추가되었습니다."); // 원하면 알림 추가
                } else {
                    console.log("북마크 해제됨");
                }
                
            } catch (e) {
                console.error("북마크 처리 실패", e);
                alert("북마크 처리 중 오류가 발생했습니다.");
            }
        };
    // 삭제
    const onDelete = async (id) => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) return;
        try {
            await BoardService.deleteMat(id);
            alert("삭제되었습니다.");
            fetchList();
            setView('list');
        } catch (e) {
            alert("삭제 실패");
        }
    };

    const goDetail = (item) => {
        setSelected(item);
        setView('detail');
    };

    return (
        <div className="board-container">
            <div className="board-header">
                <h2>🍽️ 맛집 게시판</h2>
                {view === 'list' && (
                    <button onClick={() => setView('write')} className="btn-submit">
                        ✏️ 글쓰기
                    </button>
                )}
                {view !== 'list' && (
                    <button onClick={() => setView('list')} className="btn-back">
                        ← 목록으로
                    </button>
                )}
            </div>

            {view === 'list' && (
                <BoardList
                    list={matList}
                    viewType={viewType}
                    setViewType={setViewType} 
                    onSearch={fetchList}
                    onBookmark={onBookmark}
                    loginUser={loginUser}
                    
                    onDetail={goDetail} 
                />
            )}
            {view === 'write' && (
                <BoardWrite
                    loginUser={loginUser} // 로그인 유저 전달
                    onAdd={() => { fetchList(); setView('list'); }}
                    onCancel={() => setView('list')}
                />
            )}
            {view === 'detail' && (
                <BoardItem
                    item={selected}
                    loginUser={loginUser}
                    onBookmark={onBookmark}
                    onBack={() => setView('list')}
                    onEdit={() => setView('edit')}
                    onDelete={onDelete}
                    onVoteSuccess={fetchList}
                />
            )}
            {view === 'edit' && (
                <BoardEdit
                    item={selected}
                    onUpdate={(updatedItem) => {
                        if (updatedItem) setSelected(updatedItem);
                        fetchList();
                        setView('list');
                    }}
                    onCancel={() => setView('detail')}
                />
            )}
        </div>
    );
};

export default Board;