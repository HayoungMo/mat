import React, { useState } from 'react';

const LevelupItem = ({ item, list, setList }) => {
    
    // 🌟 확장 상태 관리용 state
    const [isExpanded, setIsExpanded] = useState(false);

    const onApprove = async (e) => {
        e.stopPropagation(); // 🌟 행 클릭 이벤트와 간섭 방지
        if (!window.confirm(`${item.userId}님을 수락하시겠습니까?`)) return;

        await fetch(`/api/upgrade/${item._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
        });

        await fetch(`/api/users/${item.userId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'city' })
        });

        setList(list.filter(user => user._id !== item._id));
        alert('수락 완료!');
    };

    const onReject = async (e) => {
        e.stopPropagation(); // 🌟 행 클릭 이벤트와 간섭 방지
        if (!window.confirm(`${item.userId}님을 반려하시겠습니까?`)) return;
        
        await fetch(`/api/upgrade/${item._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'rejected' })
        });

        setList(list.filter(user => user._id !== item._id));
        alert('반려 완료!');
    };

    return (
      <div className='admin-item-outer'>
        {/* 🌟 행 전체에 클릭 이벤트 등록 (커서 포인터) */}
        <div className="levelup-item-row" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
            <span className="col-id">{item.userId}</span>
            <span className="col-city">{item.cityName}</span>
            <span className="col-date">{new Date(item.createdAt).toLocaleDateString()}</span>
            
            {/* 🌟 닫혀있을 땐 한 줄 말줄임표(...) 처리 (CSS로) */}
            <span className="col-reason">
                {!isExpanded && item.reason /* reson -> reason 오타 수정 */}
            </span>

            <div className="col-action">
                {/* 🌟 버튼에 버건디/네이비 색상 입힐 클래스명 부여 */}
                <button className="btn-approve" onClick={onApprove}>수락</button>
                <button className="btn-reject" onClick={onReject}>반려</button>
            </div>
        </div>

        {/* 🌟 확장 시 쫘악 펼쳐지는 상세 사유 영역 (reson -> reason 오타 수정) */}
        {isExpanded && (
            <div className='reason-detail-box'>
                <strong>신청 사유 상세:</strong>
                <p>{item.reason}</p>
            </div>
        )}
      </div>        
    );
};

export default LevelupItem;