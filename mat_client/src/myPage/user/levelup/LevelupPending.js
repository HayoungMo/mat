import React from 'react';
import { useNavigate } from 'react-router-dom';

const LevelupPending = () => {
    // 🌟 홈으로 돌아갈 수 있게 길잡이(navigate) 추가!
    const navigate = useNavigate();

    return (
        <section className="section-card">
            <h2 className="section-title">등업</h2> 
            
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h3 style={{ color: '#1e293b', fontSize: '22px', marginBottom: '20px' }}>
                    관리자가 정보를 확인 중입니다...
                </h3>
                
                <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', marginBottom: '15px' }}>
                   이 작업은 하루 정도 기간이 소요될 수 있습니다.
                </p>
                
                <p style={{ fontSize: '16px', color: '#8a2130', fontWeight: '700', marginBottom: '40px' }}>
                    ※ 관리자 승인 완료 후, 다시 로그인하시면 에디터 권한이 반영됩니다.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="btn btn-outline" onClick={() => navigate('/mypage/')}>
                        마이페이지
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LevelupPending;