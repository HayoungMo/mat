import React from 'react';
import upgradeServices from '../../services/upgradeServices';

const LevelupItem = ({item, list, setList}) => {
    
    const onApprove = async()=>{
        if(!window.confirm(`${item.userId}님을 수락하시겠습니까?`)) return

        await fetch(`/api/upgrade/${item._id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({status:'approved'})
        })

        await fetch(`/api/users/${item.userId}/role`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({role:'city'})
        })

        setList(list.filter(user=>user._id !== item._id))
        alert('수락 완료!')
    }

    const onReject = async()=>{
        if(!window.confirm(`${item.userId}님을 반려하시겠습니까?`)) return
        
        await fetch(`/api/upgrade/${item._id}`,{
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({status:'rejected'})
        })

        setList(list.filter(user=>user._id !== item._id))
        alert('반려 완료!')
    }

    
    return (
        <div>
            <label>아이디:</label> <span>{item.userId}</span>
            <label>지역:</label> <span>{item.cityName}</span>
            <label>신청일:</label> <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            <label>사유:</label> <span>{item.reason}</span>

            <button onClick={onApprove}>수락</button>
            <button onClick={onReject}>반려</button>
        </div>
    );
};

export default LevelupItem;