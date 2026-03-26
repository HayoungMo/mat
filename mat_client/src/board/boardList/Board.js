import React, { useEffect, useState } from 'react';
import BoardList from './BoardList';
import BoardWrite from './BoardWrite';
import BoardItem from './BoardItem';
import BoardService from './BoardService';

const Board = () => {
    const [view, setView] = useState('list');
    const [matList, setMatList] = useState([]);
    const [selected, setSelected] = useState(null);
    const [viewType, setViewType] = useState('card');

    const fetchList = async (keyword = "") => {
        try {
            const data = await BoardService.getMatList(keyword);
            setMatList(data);
        } catch (e) { 
            console.error("데이터 로드 실패", e); 
        }
    };

    useEffect(() => { 
        fetchList(); 
    }, []);

    const onDetail = (item) => {
        setSelected(item);
        setView('detail');
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            {/* 상단 헤더 영역 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2d5a3d', paddingBottom: '15px', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#2d5a3d', cursor: 'pointer' }} onClick={() => setView('list')}>🌮 맛집 기사 커뮤니티</h2>
                {view === 'list' && (
                    <button 
                        onClick={() => setView('write')} 
                        style={{ backgroundColor: '#2d5a3d', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        글쓰기
                    </button>
                )}
            </div>

            {/* 메인 화면 전환 */}
            {view === 'list' && (
                <BoardList 
                    list={matList} 
                    viewType={viewType} 
                    setViewType={setViewType} 
                    onDetail={onDetail} 
                    onSearch={fetchList} 
                />
            )}
            
            {view === 'detail' && (
                <BoardItem item={selected} onBack={() => setView('list')} />
            )}
            
            {view === 'write' && (
                <BoardWrite 
                    onAdd={() => { fetchList(); setView('list'); }} 
                    onCancel={() => setView('list')} 
                />
            )}
        </div>
    );
};

export default Board;