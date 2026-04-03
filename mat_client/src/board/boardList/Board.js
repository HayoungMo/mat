import React, { useEffect, useState, useCallback } from 'react';
import BoardList from './BoardList';
import BoardWrite from './BoardWrite';
import BoardItem from './BoardItem';
import BoardEdit from './BoardEdit';
import BoardService from './BoardService';

import { MdRestaurant, MdArticle } from "react-icons/md";
import './Board.css';

const Board = ({ loginUser }) => {
    const [path, setPath] = useState(window.location.pathname);
    const [matList, setMatList] = useState([]);
    const [viewType, setViewType] = useState('card');
    const [selectedCity, setSelectedCity] = useState("전체");
    // postStyle은 BoardItem이 subject JSON에서 직접 파싱하므로 제거됨

    const cities = ["전체", "강남구", "용산구", "동작구", "마포구", "중구"];

    useEffect(() => {
        const handlePopState = () => setPath(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const fetchList = useCallback(async (keyword = "") => {
        try {
            const data = await BoardService.getMatList(keyword);
            setMatList(Array.isArray(data) ? data.filter(item => !item.isHidden) : []);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchList(); }, [fetchList]);

    const navigateTo = (url) => {
        window.history.pushState({}, '', url);
        setPath(url);
    };

    const getPathId = () => path.split('/').pop();

    // 현재 어떤 페이지인지 판별하는 플래그
    const isList = path === '/board' || path === '/board/';
    const isWrite = path.endsWith('/write');
    const isDetail = path.includes('/detail/');
    const isEdit = path.includes('/edit/');

    return (
        <div className="board-container">
            {/* 헤더 부분: 목록일 때만 글쓰기 버튼 표시 */}
            <header className="board-header">
                <h2>
                    <MdRestaurant size={24} style={{ marginRight: 6 }} />
                    자유게시판
                </h2>
                {isList && (
                    <button className="btn-submit" onClick={() => navigateTo('/board/write')}>
                        <MdArticle size={20} style={{ marginRight: 4 }} /> 글쓰기
                    </button>
                )}
            </header>

            {/* ── 렌더링 분기: 조건이 true인 컴포넌트 '딱 하나'만 렌더링됨 ── */}

            {/* [1] 목록 화면 */}
            {isList && (
                <BoardList
                    list={matList}
                    viewType={viewType}
                    setViewType={setViewType}
                    onSearch={fetchList}
                    onDetail={(item) => navigateTo(`/board/detail/${item._id}`)}
                    cities={cities}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    loginUser={loginUser}
                    onBookmark={async (id) => {
                    // loginUser가 존재할 때만 ID를 추출해서 전달
                    if (loginUser && loginUser.id) { 
                        await BoardService.updateBookmark(id, loginUser.id); 
                        fetchList();
                    } else {
                        alert("로그인이 필요한 기능입니다.");
                    }
                }}
                />
            )}

            {/* [2] 글쓰기 화면 */}
            {isWrite && (
                <BoardWrite
                    loginUser={loginUser}
                    onAdd={() => navigateTo('/board')}
                    onCancel={() => window.history.back()}
                />
            )}

            {/* [3] 상세보기 화면 */}
            {isDetail && (
                <BoardItem
                    item={{ _id: getPathId() }}
                    loginUser={loginUser}
                    onBack={() => window.history.back()}
                    onEdit={() => navigateTo(`/board/edit/${getPathId()}`)}
                    onDelete={async (id) => {
                        if (window.confirm("삭제하시겠습니까?")) {
                            await BoardService.deleteMat(id);
                            navigateTo('/board');
                            fetchList();
                        }
                    }}
                />
            )}

            {/* [4] 수정하기 화면 */}
            {isEdit && (
                <BoardEdit
                    item={{ _id: getPathId() }}
                    onUpdate={() => navigateTo(`/board/detail/${getPathId()}`)}
                    onCancel={() => window.history.back()}
                />
            )}
        </div>
    );
};

export default Board;