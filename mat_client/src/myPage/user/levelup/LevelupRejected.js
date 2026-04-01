import React from 'react';
import { useNavigate } from 'react-router-dom';

const LevelupRejected = () => {

    const navigate = useNavigate();

    return (
        <section className="section-card">
            <h2 className="section-title">등업</h2>
            
            <div style={{ padding: '50px 20px', textAlign: 'center' }}>
                <h3 style={{ color: '#d32f2f', fontSize: '22px', marginBottom: '20px' }}>
                    등업 신청이 반려되었습니다.
                </h3>
                
                <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', marginBottom: '40px' }}>
                    작성해주신 신청 사유가 검토 기준에 미치지 못하여 반려되었습니다.<br/>
                    사유 확인이 필요하시면 아래 문의 버튼을 이용해 주세요.
                </p>

                {/* 🌟 묵직하게 분리된 버튼 삼형제! */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* 재신청 버튼 (버건디) */}
                    <button className="btn btn-primary" onClick={() => navigate('/mypage/levelup')}>
                        등업 재신청
                    </button>
                    
                    <a href='https://open.kakao.com/o/sDZGgOni' target='_blank' rel='noreferrer' style={{ textDecoration: 'none' }}>
                        <button className="btn btn-outline">
                            관리자 문의
                        </button>
                    </a>

                    <button className="btn btn-outline" style={{ backgroundColor: '#e2e8f0' }} onClick={() => navigate('/mypage/')}>
                        마이페이지
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LevelupRejected;