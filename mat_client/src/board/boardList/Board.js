import React, { useEffect, useState } from 'react';
import BoardList from './BoardList';
import BoardWrite from './BoardWrite';
import BoardItem from './BoardItem';
import BoardEdit from './BoardEdit';
import BoardService from './BoardService';
import './Board.css';

const Board = () => {
    const [view, setView] = useState('list'); // list, write, detail, edit
    const [matList, setMatList] = useState([]);
    const [selected, setSelected] = useState(null);

    // 데이터 불러오기 함수
    const fetchList = async (keyword = "") => {
        try {
            const data = await BoardService.getMatList(keyword);
            setMatList(data);
        } catch (e) {
            console.error("데이터 로드 실패", e);
        }
    };

    useEffect(() => { fetchList(); }, []);

    // 삭제 처리 함수
    const onDelete = async (id) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await BoardService.deleteMat(id);
                alert("삭제되었습니다.");
                fetchList();
                setView('list');
            } catch (e) { alert("삭제 실패"); }
        }
    };

    return (
        <div className="board-container">
            <div className="board-header">
                <h2>맛집 게시판</h2>
                {view === 'list' && <button onClick={() => setView('write')} className="btn-submit">글쓰기</button>}
            </div>

            {view === 'list' && <BoardList list={matList} onDetail={(item) => { setSelected(item); setView('detail'); }} onSearch={fetchList} />}
            {view === 'write' && <BoardWrite onAdd={() => { fetchList(); setView('list'); }} onCancel={() => setView('list')} />}
            {view === 'detail' && <BoardItem item={selected} onBack={() => setView('list')} onEdit={() => setView('edit')} onDelete={onDelete} />}
            {view === 'edit' && <BoardEdit item={selected} onUpdate={() => { fetchList(); setView('list'); }} onCancel={() => setView('list')} />}
        </div>
    );
};

export default Board;