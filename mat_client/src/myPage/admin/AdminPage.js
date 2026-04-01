import React from 'react';
import LevelupList from './LevelupList';
import './AdminPage.css'; // 🌟 어드민 전용 CSS 파일 임포트!

const AdminPage = ({ loginUser, loginInfo }) => {

    return (
        <div className="admin-page-wrapper">
            <div className="admin-profile-banner">
                <div className="admin-profile-avatar">
                    <div className="admin-avatar-text">
                        {loginUser ? loginUser.charAt(0).toUpperCase() : 'A'}
                    </div>
                </div>
                <div className="admin-profile-info">
                    <h2>반갑습니다, <span className="admin-highlight-text">{loginUser}</span>님!</h2>
                    <p className="admin-profile-role">현재 권한 : <strong>최고 관리자 (Admin)</strong></p>
                </div>
            </div>

            <div className="admin-content-section">
                <h3>등업 관리</h3>
                <LevelupList/>
            </div>
        </div>
    );
};

export default AdminPage;