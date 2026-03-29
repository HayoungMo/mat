import React from 'react';
import {useNavigate} from 'react-router-dom';

const LevelupRejected = () => {

    const navigate = useNavigate()

    return (
        <div>
            <h2>등업 신청이 반려되었습니다.</h2>
            <p>다시 신청하거나, 관리자에게 반려 사유를 문의해주세요...</p>
            <button onClick={()=>navigate('/mypage/levelup')}>등업 재신청</button>
            <a href='https://open.kakao.com/o/sDZGgOni'target='_blank' rel='noreferrer'><button>관리자 문의</button></a>
        </div>
    );
};

export default LevelupRejected;