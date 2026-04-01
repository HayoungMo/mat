import React, { useState } from 'react';
import CityMyhome from './CityMyhome';
import { useNavigate } from 'react-router-dom';
import './CityPage.css'; 
import axios from 'axios';

const CityPage = ({ loginUser, loginInfo }) => {
    const navigate = useNavigate();
    
    // 🌟 정보수정 폼을 열고 닫는 스위치 (기본값: false = 숨김)
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // 🌟 수정 버튼을 누르면 스위치를 껐다 켰다 합니다.
    const handleEditProfile = () => {
        setIsEditingProfile(!isEditingProfile); 
    };

    const handleDeleteAccount = async() => {
        if(window.confirm('정말로 기자 계정을 삭제(탈퇴)하시겠습니까? 작성한 기사의 저작권은 영구적으로 Eat-log 팀에 귀속됩니다.')) {
            try{
                await axios.delete('/api/profile',{
                    data: {id: loginInfo._id}
                });
                alert('계정이 삭제되었습니다. 그동안 감사했습니다.');
                window.location.href = '/'; 
            }catch(error){
                console.error('계정 삭제 실패:',error);
                alert('계정 삭제 중 오류 발생.');
            }
        }
    };

    return (
        <div className="city-page-wrapper">
            <div className="city-profile-banner">
                <div className="city-profile-left">
                    <div className="city-profile-avatar">
                        <div className="city-avatar-text">
                            {loginUser ? loginUser.charAt(0).toUpperCase() : 'C'}
                        </div>
                    </div>
                    <div className="city-profile-info">
                        <h2>반갑습니다, <span className="city-highlight-text">{loginUser}</span> 기자님!</h2>
                        <p className="city-profile-role">현재 권한 : <strong>맛집 에디터 (City)</strong></p>
                    </div>
                </div>

                <div className="city-profile-actions">
                    {/* 🌟 열려있을 땐 '수정 닫기'로 텍스트 변경 */}
                    <button className="btn-profile-edit" onClick={handleEditProfile}>
                        {isEditingProfile ? '수정 닫기' : '정보 수정'}
                    </button>
                    <button className="btn-profile-del" onClick={handleDeleteAccount}>계정 삭제</button>
                </div>
            </div>

            <div className="content-section">
                {/* 🌟 스위치 상태를 자식 컴포넌트인 CityMyhome으로 전달합니다 */}
                <CityMyhome 
                    loginInfo={loginInfo} 
                    loginUser={loginUser} 
                    isEditingProfile={isEditingProfile} 
                    setIsEditingProfile={setIsEditingProfile}
                /> 
            </div>
        </div>
    );
};

export default CityPage;