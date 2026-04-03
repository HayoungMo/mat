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
    const [postStyle, setPostStyle] = useState({ font: "'Malgun Gothic', sans-serif", align: 'left' });

    const cities = ["전체", "강남구", "용산구", "동작구", "마포구", "중구"];

    const navigateTo = (url) => {
        window.history.pushState({}, '', url);
        setPath(url);
    };

    const fetchList = useCallback(async (keyword = "") => {
        try {
            const data = await BoardService.getMatList(keyword);
            setMatList(Array.isArray(data) ? data.filter(item => !item.isHidden) : []);
        } catch (e) { console.error("리스트 로드 실패", e); }
    }, []);

    useEffect(() => {
        fetchList();
        const handlePopState = () => setPath(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [fetchList]);

    const getPathId = () => path.split('/').pop();

    // 페이지 판별 플래그
    const isList = path === '/board' || path === '/board/';
    const isWrite = path.endsWith('/write');
    const isDetail = path.includes('/detail/');
    const isEdit = path.includes('/edit/');

    // 공통 북마크 핸들러 (400 에러 방지를 위한 예외 처리 포함)
  // Board.js 내부 (예상되는 handleBookmark 위치)
const handleBookmark = async (id) => {
    if (!loginUser) {
        alert("로그인이 필요합니다.");
        return;
    }

    try {
        // loginUser가 객체라면 .id 또는 .userId 인지 확인 필수!
        const uid = loginUser.id || loginUser.userId || loginUser; 
        await BoardService.updateBookmark(id, uid);
        fetchList(); // 목록 새로고침
    } catch (e) {
        console.error("북마크 업데이트 실패", e.response?.data); // 서버가 보낸 구체적 에러 확인
    }
};

    return (
        <div className="board-container">
            <header className="board-header">
                <h2><MdRestaurant size={24} /> 자유게시판</h2>
                {isList && (
                    <button className="btn-submit" onClick={() => navigateTo('/board/write')}>
                        <MdArticle size={20} /> 글쓰기
                    </button>
                )}
            </header>

            {isList && (
                <BoardList 
                    list={matList} viewType={viewType} setViewType={setViewType}
                    onSearch={fetchList} onDetail={(item) => navigateTo(`/board/detail/${item._id}`)}
                    cities={cities} selectedCity={selectedCity} setSelectedCity={setSelectedCity}
                    loginUser={loginUser} onBookmark={handleBookmark}
                />
            )}

            {isWrite && (
                <BoardWrite 
                    loginUser={loginUser} onAdd={() => navigateTo('/board')}
                    onCancel={() => window.history.back()} onStyleChange={setPostStyle}
                />
            )}

            {isDetail && (
                <BoardItem 
                    item={{ _id: getPathId() }} loginUser={loginUser} viewType={viewType}
                    onBack={() => navigateTo('/board')}
                    onEdit={() => navigateTo(`/board/edit/${getPathId()}`)}
                    onDelete={async (id) => {
                        if (window.confirm("삭제하시겠습니까?")) {
                            await BoardService.deleteMat(id);
                            navigateTo('/board');
                            fetchList();
                        }
                    }}
                    onBookmark={handleBookmark} // ✅ 이 함수가 제대로 전달되어야 함
                    postStyle={postStyle}
                />
            )}

            {isEdit && (
                <BoardEdit 
                    item={{ _id: getPathId() }}
                    onUpdate={() => navigateTo(`/board/detail/${getPathId()}`)}
                    onCancel={() => window.history.back()} onStyleChange={setPostStyle}
                />
            )}
        </div>
    );
};

export default Board;