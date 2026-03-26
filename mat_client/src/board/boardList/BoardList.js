

import React, { useState } from 'react';
import BoardForm from './BoardForm';

const BoardList = ({ list = [], viewType, setViewType, onDetail, onSearch }) => {
    // 페이지네이션을 위한 임시 상태 (실제 서버 페이징 연동 전 UI용)
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5; // 한 페이지당 5개씩

    return (
        <div>
            {/* [상단 첫 단] 인기 설문 - 데이터 수정 불가능하게 처리 */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                {['오늘 저메추?', '강남구 점심 어디?', '해장은 어떻게?'].map((title, i) => (
                    <div key={i} style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #efebe9', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#795548' }}>{title}</h4>
                        <div style={{ fontSize: '13px', color: '#a1887f' }}>
                            {/* disabled 속성으로 수정 방지  */}
                            <p><input type="radio" disabled checked={i===1} /> 메뉴 1 <span style={{ float: 'right', width: '50%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', marginTop: '5px' }}></span></p>
                            <p><input type="radio" disabled /> 메뉴 2 <span style={{ float: 'right', width: '50%', height: '8px', backgroundColor: '#ffccbc', borderRadius: '4px', marginTop: '5px' }}></span></p>
                        </div>
                    </div>
                ))}
            </div>


   
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#5d4037' }}>📋 게시글 목록 ({list.length})</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setViewType('card')} style={{ padding: '5px 12px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: viewType === 'card' ? '#eee' : '#fff', cursor: 'pointer' }}>이미지형</button>
                    <button onClick={() => setViewType('list')} style={{ padding: '5px 12px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: viewType === 'list' ? '#eee' : '#fff', cursor: 'pointer' }}>목록형</button>
                </div>
            </div>

           
            <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#fff', borderRadius: '50px', border: '1px solid #d7ccc8', textAlign: 'center' }}>
                <BoardForm onSearch={onSearch} />
            </div>
           
            <div style={{ display: 'grid', gridTemplateColumns: viewType === 'card' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: '20px' }}>
                {list.length > 0 ? (
                    list.map((item) => (
                        <div key={item._id} onClick={() => onDetail(item)} style={{
                            border: '1px solid #efebe9', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                            backgroundColor: '#fff', display: viewType === 'card' ? 'block' : 'flex', alignItems: 'center', padding: viewType === 'list' ? '10px 20px' : '0'
                        }}>
                            {/* 카드형일 때만 이미지 노출  */}
                            {viewType === 'card' && (
                                <div style={{ width: '100%', height: '160px', backgroundColor: '#f5f5f5' }}>
                                    <img src={item.saveFileName ? `http://localhost:4000/uploads/${item.saveFileName}` : '/no-image.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                </div>
                            )}

                            <div style={{ padding: '15px', flex: 1 }}>
                                <div style={{ color: '#2d5a3d', fontSize: '12px', fontWeight: 'bold' }}>#{item.region}</div>
                                <h3 style={{ margin: '5px 0', fontSize: '16px' }}>{item.title}</h3>
                                <div style={{ fontSize: '13px', color: '#999' }}>📍 {item.matName} | 👤 {item.userId}</div>
                            </div>

                            {/* 목록형일 때는 우측에 날짜와 '보기' 버튼 배치 */}
                            {viewType === 'list' && (
                                <div style={{ padding: '0 10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#ccc' }}>{new Date(item.sysdate).toLocaleDateString()}</span>
                                    <button style={{ border: '1px solid #ddd', background: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>보기</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '50px', color: '#999' }}>게시글이 없습니다.</div>
                )}
            </div>

            {/* [최하단] 페이지네이션 (그림의 숫자 버튼 구현) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '30px' }}>
                <button style={{ padding: '5px 10px', border: '1px solid #ddd', background: '#fff' }}>&laquo;</button>
                {[1, 2, 3].map(num => (
                    <button key={num} onClick={() => setCurrentPage(num)} style={{
                        padding: '5px 12px', border: '1px solid #ddd', 
                        background: currentPage === num ? '#8d6e63' : '#fff',
                        color: currentPage === num ? '#fff' : '#333',
                        cursor: 'pointer', borderRadius: '4px'
                    }}>{num}</button>
                ))}
                <button style={{ padding: '5px 10px', border: '1px solid #ddd', background: '#fff' }}>&raquo;</button>
            </div>
        </div>
    );
};

export default BoardList;