import React from 'react';

const BoardItem = ({ item, onBack, onEdit, onDelete }) => {
    if (!item) return null;

    return (
        <div className="detail-container">
            <div className="detail-header">
                <h3>[{item.type.toUpperCase()}] {item.title}</h3>
                <p>작성자: {item.userId} | 파일: {item.originalFileName || '없음'}</p>
            </div>

            <div className="detail-body">
                {/* 1. 이미지 타입일 때 */}
                {item.type === 'image' && item.saveFileName && (
                    <div className="image-box">
                        <img src={`http://localhost:4000/uploads/${item.saveFileName}`} alt="첨부사진" />
                    </div>
                )}

                {/* 2. 설문 타입일 때 */}
                {item.type === 'survey' ? (
                    <div className="survey-display">
                        <p>📊 아래 항목 중 선택해 주세요</p>
                        <button className="opt-btn">{item.opt1}</button>
                        <button className="opt-btn">{item.opt2}</button>
                    </div>
                ) : (
                    /* 3. 일반 텍스트 타입일 때 */
                    <div className="subject-text">{item.subject}</div>
                )}
            </div>

            <div className="detail-footer">
                <button onClick={onBack}>목록</button>
                <button onClick={onEdit}>수정</button>
                <button onClick={() => onDelete(item._id)} className="btn-delete">삭제</button>
            </div>
        </div>
    );
};

export default BoardItem;