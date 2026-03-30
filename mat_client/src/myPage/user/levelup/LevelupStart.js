import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const LevelupStart = ({ugUsers,loginInfo}) => {

    const navigate = useNavigate()
    const request = ugUsers[0]

    useEffect(()=>{
        console.log('ugUsers:',ugUsers)
        console.log('request:',request)
        if (!request){
         navigate('/mypage/levelup')
        } else if(request.status === 'pending') {
          navigate('/mypage/pending')
        } else if(request.status === 'approved'){
            navigate('/mypage')
        } else {
             navigate('/mypage/rejected')
        }
    },[request, navigate, ugUsers])
    
    return (
        <div>
            로딩중...
        </div>
    );
};

export default LevelupStart;