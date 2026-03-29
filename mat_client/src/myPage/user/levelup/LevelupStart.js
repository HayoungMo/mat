import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelupPending from './LevelupPending';
import LevelupRejected from './LevelupRejected'; 


const LevelupStart = ({ugUsers,loginUser}) => {

    const navigate = useNavigate()
    const request = ugUsers[0]

    //모하영 - 3월 29일
    //신청 이력 없음 -> 마이페이지 + 등업 버튼

    if(!request) {
        return(
            <div>
                <h2>{loginUser}님의 마이페이지</h2>
                <p>등업 신청 이력이 없습니다</p>
                <button onClick={()=>navigate('/mypage/levelup')}>등업 신청</button>
            </div>
        )
    }

    //대기중 을 여기서 보여줌
    if(request.status === 'pending'){
        return <LevelupPending/>
    }

    //승인됨 -> 안내 (navigate('/mypage') 하면 무한 루프된다)
    if(request.status === 'approved'){
        return(
            <div>
                <h2>등업이 승인되었습니다!</h2>
                <p>재로그인 시 반영됩니다.</p>
            </div>
        )
    }

    // useEffect(()=>{
    //     console.log('ugUsers:',ugUsers)
    //     console.log('request:',request)
    //     if (!request){
    //      navigate('/mypage/levelup')
    //     } else if(request.status === 'pending') {
    //       navigate('/mypage/pending')
    //     } else if(request.status === 'approved'){
    //         navigate('/mypage')
    //     } else {
    //          navigate('/mypage/rejected')
    //     }
    // },[request, navigate, ugUsers])
    
    //반려
    return <LevelupRejected/>
        
    
};

export default LevelupStart;