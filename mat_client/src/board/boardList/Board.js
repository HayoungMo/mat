import React, { useEffect, useState, useCallback } from 'react';
import BoardList from './BoardList';
import BoardWrite from './BoardWrite';
import BoardItem from './BoardItem';
import BoardEdit from './BoardEdit';
import BoardService from './BoardService';
import './Board.css';

const Board = () => {
    const [view, setView] = useState('list');        // list | write | detail | edit
    const [matList, setMatList] = useState([]);
    const [selected, setSelected] = useState(null);
    const [viewType, setViewType] = useState('card'); // card | list

    // [R] 목록 불러오기 - useCallback으로 안정화
    const fetchList = useCallback(async (keyword = "") => {
        try {
            const data = await BoardService.getMatList(keyword);
            setMatList(data);
        } catch (e) {
            console.error("데이터 로드 실패", e);
        }
    }, []);

    useEffect(() => { fetchList(); }, [fetchList]);

    // [U] 북마크 토글
    const onBookmark = async (id) => {
        try {
            await BoardService.updateBookmark(id);
            fetchList();
        } catch (e) {
            alert("북마크 처리 실패");
        }
    };

    // [D] 삭제
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

    // 상세 보기 이동 + selected 갱신
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
                        // 수정 후 selected도 최신 데이터로 업데이트
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
