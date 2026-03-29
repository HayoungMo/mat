import React, { useEffect, useState, useCallback } from 'react';
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
    const [loading, setLoading] = useState(false);
    
    // ✅ 지역 필터 상태 추가
    const [selectedCity, setSelectedCity] = useState("전체");
    const cities = ["전체", "강남구", "용산구", "동작구", "마포구", "중구"];

    const fetchList = useCallback(async (keyword = "") => {
        setLoading(true);
        try {
            const data = await BoardService.getMatList(keyword);
            setMatList(Array.isArray(data) ? data.filter(item => !item.isHidden) : []);
        } catch (e) {
            console.error("데이터 로드 실패", e);
            setMatList([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

  
    const onBookmark = async (id) => {
        // 1. 로그인 여부 확인
        if (!loginUser) {
            alert("로그인이 필요한 서비스입니다. 로그인 후 이용해주세요! 😊");
            return;
        }

        try {
            // 2. 서버에 게시글 ID와 현재 로그인한 유저 ID를 같이 보냄
            await BoardService.updateBookmark(id, loginUser);
            
            // 3. 목록 새로고침
            fetchList(); 
        } catch (e) {
            console.error("북마크 처리 실패:", e);
            alert("북마크 처리 중 오류가 발생했습니다.");
        }
    };
    const onDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await BoardService.deleteMat(id);
            alert("삭제되었습니다.");
            setView('list');
            fetchList();
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
            <header className="board-header">
                <h2>🍴 맛집 커뮤니티</h2>
                
                {view === 'list' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button className="btn-submit" onClick={() => setView('write')}>
                            ✍️ 글쓰기
                        </button>
                    </div>
                )}
            </header>

            {view === 'list' && (
                <BoardList
                    list={matList}
                    viewType={viewType}
                    setViewType={setViewType}
                    onSearch={fetchList}
                    onBookmark={onBookmark}
                    loginUser={loginUser}
                    onDetail={goDetail}
                    cities={cities}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                />
            )}

            {view === 'write' && (
                <BoardWrite
                    loginUser={loginUser}
                    onAdd={() => { fetchList(); setView('list'); }}
                    onCancel={() => setView('list')}
                />
            )}

            {view === 'detail' && selected && (
                <BoardItem
                    item={selected}
                    loginUser={loginUser}
                    viewType={viewType} 
                    onBookmark={onBookmark}
                    onBack={() => setView('list')}
                    onEdit={() => setView('edit')}
                    onDelete={onDelete}
                    onVoteSuccess={fetchList}
                />
            )}

            {view === 'edit' && selected && (
                <BoardEdit
                    item={selected}
                    onUpdate={() => { fetchList(); setView('list'); }}
                    onCancel={() => setView('detail')}
                />
            )}
        </div>
    );
};

export default Board;