import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelupPending from './LevelupPending';
import LevelupRejected from './LevelupRejected'; 

const LevelupStart = ({ugUsers,loginUser}) => {

    const navigate = useNavigate()
    const request = ugUsers[0]

    // 1. 신청 이력 없음 -> 등업 신청 유도
    if(!request) {
        return(
            <section className='section-card'>
                <h2 className='section-title'>에디터 등업 신청</h2>
                <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', color: '#555', marginBottom: '25px' }}>
                        등업 신청 이력이 없습니다. MAT 매거진의 지역 에디터가 되어주세요!
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={()=>navigate('/mypage/levelup')}>등업 신청하기</button>
                    <button className="btn btn-outline" onClick={()=>navigate('/mypage/')}>마이페이지 홈</button>
                    </div>
                    
                </div>
            </section>
        )
    }

    // 2. 대기중 -> 펜딩 컴포넌트로 (거기서 section-card 씌워둠)
    if(request.status === 'pending'){
        return <LevelupPending/>
    }

    // 3. 승인됨 -> 승인 안내
    if(request.status === 'approved'){
        return(
            <section className='section-card'>
                <h2 className='section-title'>등업 승인 완료</h2>
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <h3 style={{ color: '#8a2130', marginBottom: '15px' }}>🎉 축하합니다! 등업이 승인되었습니다!</h3>
                    <p style={{ fontSize: '16px', color: '#555' }}>재로그인 시 지역 기자(에디터) 권한이 반영됩니다.</p>
                </div>
            </section>
        )
    }

    // 4. 반려 -> 리젝티드 컴포넌트로
    return <LevelupRejected/>
};

export default LevelupStart;