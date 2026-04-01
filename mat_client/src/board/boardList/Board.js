import React, { useEffect, useState, useCallback } from 'react';
import BoardList from './BoardList';
import BoardWrite from './BoardWrite';
import BoardItem from './BoardItem';
import BoardEdit from './BoardEdit';
import BoardService from './BoardService';
import { MdRestaurant, MdArticle } from "react-icons/md";
import './Board.css';

const Board = ({ loginUser }) => {
    const [view, setView] = useState('list');
    const [matList, setMatList] = useState([]);
    const [selected, setSelected] = useState(null);
    const [viewType, setViewType] = useState('card');
    const [loading, setLoading] = useState(false);
    
    const [selectedCity, setSelectedCity] = useState("전체");
    const cities = ["전체", "강남구", "용산구", "동작구", "마포구", "중구"];

    // ✅ 1. 브라우저 뒤로가기(Alt + 왼쪽 방향키) 감지 로직
    useEffect(() => {
        // 첫 진입 시 현재 상태(list)를 히스토리에 기록
        if (!window.history.state) {
            window.history.replaceState({ view: 'list' }, '');
        }

        const handlePopState = (event) => {
            // 브라우저 뒤로가기 발생 시 실행
            if (event.state && event.state.view) {
                setView(event.state.view);
                if (event.state.selected) {
                    setSelected(event.state.selected);
                } else {
                    setSelected(null);
                }
            } else {
                setView('list');
                setSelected(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // ✅ 2. 화면 전환 함수 (기록을 남기며 이동)
    const changeView = (newView, item = null) => {
        setSelected(item);
        setView(newView);
        // 브라우저 히스토리 스택에 현재 뷰와 선택된 아이템 저장
        window.history.pushState({ view: newView, selected: item }, '');
    };

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
        if (!loginUser) {
            alert("로그인이 필요한 서비스입니다. 로그인 후 이용해주세요! 😊");
            return;
        }
        try {
            await BoardService.updateBookmark(id, loginUser);
            fetchList(); 
        } catch (e) {
            console.error("북마크 처리 실패:", e);
        }
    };

    const onDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await BoardService.deleteMat(id);
            alert("삭제되었습니다.");
            // 삭제 후에는 히스토리를 덮어쓰며 리스트로 이동
            window.history.replaceState({ view: 'list' }, '');
            setView('list');
            fetchList();
        } catch (e) {
            alert("삭제 실패");
        }
    };

    const goDetail = (item) => {
        changeView('detail', item);
    };

    return (
        <div className="board-container">
            <header className="board-header">
                <h2>
                    <MdRestaurant size={24} style={{ marginRight: 6 }} />
                    자유게시판
                </h2>
                
                {view === 'list' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button className="btn-submit" onClick={() => changeView('write')}>
                            <MdArticle size={20} style={{ marginRight: 4 }} />
                            글쓰기
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
                    onAdd={() => { 
                        fetchList(); 
                        window.history.replaceState({ view: 'list' }, '');
                        setView('list'); 
                    }}
                    onCancel={() => window.history.back()}
                />
            )}

            {view === 'detail' && selected && (
                <BoardItem
                    item={selected}
                    loginUser={loginUser}
                    viewType={viewType} 
                    onBookmark={onBookmark}
                    onBack={() => window.history.back()} 
                    onEdit={() => changeView('edit', selected)}
                    onDelete={onDelete}
                    onVoteSuccess={fetchList}
                />
            )}

            {view === 'edit' && selected && (
                <BoardEdit
                    item={selected}
                    onUpdate={() => { 
                        fetchList(); 
                        window.history.replaceState({ view: 'list' }, '');
                        setView('list'); 
                    }}
                    onCancel={() => window.history.back()} 
                />
            )}
        </div>
    );
};

export default Board;