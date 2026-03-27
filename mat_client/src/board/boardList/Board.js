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

    // 북마크 토글 + 알림 + 마이페이지 이동 확인
    const onBookmark = async (id) => {
        try {
            const res = await BoardService.updateBookmark(id);
            const isBookmarked = res.data?.isBookmarked;
            fetchList();

            if (isBookmarked) {
                // 북마크 추가됐을 때만 알림
                const goMyPage = window.confirm(
                    "⭐ 북마크에 추가되었습니다!\n마이페이지에서 확인하시겠습니까?"
                );
                if (goMyPage) navigate('/mypage');
            } else {
                alert("북마크가 해제되었습니다.");
            }
        } catch (e) {
            alert("북마크 처리 실패");
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
                    onDetail={goDetail}
                    onSearch={fetchList}
                    onBookmark={onBookmark}
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