import React, { useEffect, useState } from 'react';
import UserMyPageItem from './UserMyPageItem';
import UserMyPageList from './UserMyPageList';
import { Link, useNavigate } from 'react-router-dom';
import UserMyPageProfile from './UserMyPageProfile';
import reviewService from '../../services/reviewService';
import profileService from '../../services/profileService';
import * as bookmarkService from '../../services/bookmarkService';
import UserProfileUpdate from './UserProfileUpdate';
import UserMyPageBookmark from './UserMyPageBookmark';
import MapPage from '../../map/MapPage';
import { BookmarkProvider } from '../../contexts/BookmarkContext';
import './UserMyPage.css';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import LevelupStart from './levelup/LevelupStart';
import LevelupAdd from './levelup/LevelupAdd';
import LevelupPending from './levelup/LevelupPending';
import LevelupRejected from './levelup/LevelupRejected';

const UserMyPage = ({loginUser, className, ugUsers}) => {

    const navigate = useNavigate();
    const request = ugUsers?.[0];
    const [users, setUsers] = useState([]);
    const [profile, setProfile] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    
    // 탈퇴 커스텀 모달 상태
    const [showDelModal, setShowDelModal] = useState(false);

    const [current, setCurrent] = useState({});
    const [bookmark, setBookmark] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [toast, setToast] = useState(null);

    // ★ 토스트 알림 통합 제어 함수 (alert 대체용)
    const showToast = (message, type = 'approved') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        onData();
        onProfile();
        onBookmark(); // ★ 누락되었던 북마크 호출 복구
    }, []);
            
    useEffect(() => {
        if(!request || !loginUser) return;

        const { status } = request;
        if(status !== 'approved' && status !== 'rejected') return;
        
        const notifyKey = `notified_${loginUser}_${status}`;
        if(localStorage.getItem(notifyKey)) return;
        
        localStorage.setItem(notifyKey, 'true');
        
        if(status === 'rejected'){
            showToast('등업 신청이 거절됐습니다.', 'rejected');
        }

        if(status === 'approved'){
            localStorage.setItem('pendingToast', '등업 신청이 승인됐습니다.');
            localStorage.setItem('pendingToastType','approved');
        }
        
    }, [request, loginUser]);

    const onEdit = (user) => {
        setCurrent(user);
        setIsEdit(true);
    };

    // 업데이트 수정
    const onUpdate = async (user) => {
        if(!profile.currentPassword){
            showToast('비밀번호를 입력해주세요!', 'rejected'); // alert 교체
            return;
        }

        try {
            await axios.put('/api/profile', {
                id: profile._id,
                currentPassword: profile.currentPassword, 
                newPassword: profile.password,            
                tel: profile.tel,
                email: profile.email
            });

            setIsEdit(false);
            setProfile(prev => ({ ...prev, currentPassword: '' })); 
            onProfile(); 
            showToast('프로필 수정 완료.', 'approved'); // alert 교체

        } catch(error) {
            console.error('비밀번호 검증 or update 오류', error);
            
            if (error.response && error.response.status === 401) {
                showToast('현재 비밀번호가 일치하지 않습니다. 다시 확인해주세요.', 'rejected'); // alert 교체
            } else {
                showToast('비밀번호가 다릅니다.', 'rejected'); // alert 교체
            }
        }
    };
    
    // 탈퇴 버튼 클릭 시 모달 열기
    const onUserDelClick = () => {
        setShowDelModal(true);
    };

    // 모달에서 '탈퇴하기' 눌렀을 때 실행되는 로직
    const confirmUserDel = async () => {
        try {
            await fetch('/api/upgrade', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: loginUser })
            });

            await profileService.deleteProfile(profile._id);
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
            localStorage.removeItem(`notified_${loginUser}_approved`);
            localStorage.removeItem(`notified_${loginUser}_rejected`);

            showToast('탈퇴가 완료 되었습니다.', 'approved'); // alert 교체
            
            // 토스트를 읽을 수 있도록 1.5초 대기 후 메인으로 이동
            setTimeout(() => {
                window.location.href = '/'; 
            }, 1500);

        } catch (err) {
            console.log('탈퇴 오류', err);
            showToast('탈퇴 중 오류가 발생했습니다.', 'rejected'); // alert 교체
        } finally {
            setShowDelModal(false);
        }
    };

    const onData = async () => {
        try {
            const res = await reviewService.getReview(loginUser);
            setUsers(res); 
        } catch(err) {
            console.error(err);
            setUsers([]);
        }
    };

    const onDel = async (item) => {
        await reviewService.deleteReview(item._id);
        onData();
        showToast('리뷰가 삭제되었습니다.', 'approved'); // alert 교체
    };

    const onProfile = async () => {
        try {
            const res = await profileService.getProfile(loginUser);
            if(res){
                setProfile(res);
            }
        } catch(err) {
            console.error(err);
            setProfile({});
        }
    };

    // ★ 누락되었던 북마크 데이터 로드 함수 복구
    const onBookmark = async () => {
        try {
            const res = await bookmarkService.getBookmarks(loginUser);
            if(res) {
                setBookmark(res);
            }
        } catch(err) {
            console.error(err);
            setBookmark([]);
        }
    };

    const changeInput = (evt) => {
        // 이메일에 한글 입력 방지
        const { value, name } = evt.target;
        if(name === 'email' && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)){
            showToast('이메일에 한글은 입력할 수 없습니다', 'rejected'); // alert 교체
            return;
        }
        setProfile({ ...profile, [name]: value });
    };

    return (
        <div className='mypage-wrapper'>
         
         {/* 우측 상단 토스트 알림창 */}
         {
            toast &&(
                <div className={`toast-notification toast-${toast.type}`}>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)}>✕</button>
                </div>
            )
         }

            <div className='mypage-body'>
            <aside className="mypage-sidebar">
            <div className="profile-card">    
            <h3 className='profile-card-title'>프로필</h3>
            
            <UserMyPageProfile profile={profile} onEdit={onEdit} isEdit={isEdit} changeInput={changeInput} loginUser={loginUser}/>
            <div className='profile-actions'>
           {isEdit
            ? <>
                <button className='btn btn-primary' onClick={onUpdate}>저장</button>
                <button className='btn btn-outline' onClick={() => { setIsEdit(false); onProfile(); }}>취소</button>
              </>
            : <button className='btn btn-primary' onClick={() => setIsEdit(true)}>정보 수정</button>            
        }
        
       
        {request?.status === 'pending' ? (
            <button onClick={() => navigate('/mypage/levelup-check')}>등업 확인하기</button>
        ) : request?.status === 'rejected' ? (
            <button onClick={() => navigate('/mypage/levelup-check')}>등업 확인하기</button>
        ) : request?.status === 'approved' ? (
            <span>등업 완료!</span>
        ) : (
            <button className='btn btn2' onClick={() => navigate('/mypage/levelup-check')}>등업 신청</button>
        )}
         
         {/* 커스텀 모달을 여는 탈퇴 버튼 */}
         <button className='btn btn3' onClick={onUserDelClick}>회원 탈퇴</button>

         </div>
        </div>
        </aside>

        <main className='mypage-content'>
                <Routes>
                    <Route path="/" element={
                        <>
                            <section className='section-card'>
                                <h2 className='section-title'>내가 쓴 글</h2>
                                <UserMyPageList users={users} onDel={onDel}/>
                            </section>

                            <section className='section-card'>
                                <h2 className='section-title'>북마크</h2>
                                <BookmarkProvider loginUser={loginUser}>
                                    <div className="bookmark-section">
                                        <div className="bookmark-list-area">
                                            <UserMyPageBookmark onDel={onDel} loginUser={loginUser} onSelectPlace={setSelectedPlace} />
                                        </div>
                                        <div className="bookmark-map-area"> 
                                            <MapPage selectedPlace={selectedPlace} showSearch={false}/>
                                        </div>  
                                    </div>
                                </BookmarkProvider>
                            </section>
                        </>
                    } />

                    <Route path="/levelup-check" element={<LevelupStart loginUser={loginUser} ugUsers={ugUsers}/>} />
                    <Route path="/levelup" element={<LevelupAdd loginUser={loginUser}/>} />
                    <Route path="/pending" element={<LevelupPending/>} />
                    <Route path="/rejected" element={<LevelupRejected/>} />
                </Routes>
            </main>
           </div>

           {/* 커스텀 회원 탈퇴 모달 UI */}
           {showDelModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <h3 className="modal-warn-title">회원 탈퇴</h3>
                        <p>회원 탈퇴 시 모든 정보가 영구 삭제됩니다.<br/>정말 탈퇴하시겠습니까?</p>
                        <div className="modal-btn-group">
                            <button className="btn-cancel" onClick={() => setShowDelModal(false)}>취소</button>
                            <button className="btn-danger" onClick={confirmUserDel}>탈퇴하기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMyPage;