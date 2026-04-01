import React, { useEffect, useState } from 'react';
import UserMyPageItem from './UserMyPageItem';
import UserMyPageList from './UserMyPageList';
import { Link,useNavigate } from 'react-router-dom';
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
import LevelupRejected from './levelup/LevelupRejected'

const UserMyPage = ({loginUser, className, ugUsers}) => {

     const navigate = useNavigate()
     const request = ugUsers?.[0]
     const [users,setUsers] = useState([])
     const [profile,setProfile] = useState({})
     const [isEdit,setIsEdit] = useState(false)
     const [isUserDel, setIsUserDel] = useState(false) //모하영 탈퇴유저 추가
     const [current,setCurrent] =useState({})
     const [bookmark,setBookmark] = useState([])
     const [selectedPlace, setSelectedPlace] = useState(null)
     const [toast,setToast] = useState(null)

     console.log('loginUser 확인',loginUser)
     console.log(selectedPlace);
    

        useEffect(() => {
            onData()
             onProfile()
         },[])
                 
        useEffect(()=>{
            if(!request || !loginUser) return

            const {status} = request
            if(status !== 'approved' && status !=='rejected') return
            
            const notifyKey = `notified_${loginUser}_${status}`
            if(localStorage.getItem(notifyKey)) return
            
            if(status === 'rejected'){
                setToast({message:'등업 신청이 거절됐습니다.',type:'rejected'})
                const timer = setTimeout(()=>setToast(null),5000)
                return ()=> clearTimeout(timer)
            }

            if(status === 'approved'){
                localStorage.setItem('pendingToast', '등업 신청이 승인됐습니다.')
                localStorage.setItem('pendingToastType','approved')
            }
            
        },[request,loginUser])

         const onEdit = (user) => {
            console.log('onEdit 받은 데이터:',user)
            setCurrent(user)
            setIsEdit(true)
         }

         //업데이트 수정(04.01)
        const onUpdate= async (user) =>{
            console.log('onUpdate 호출됨: ',profile)

            if(!profile.currentPassword){
                alert('비밀번호를 입력해주세요!')
                return
            }

            try{

                await axios.put('/api/profile',{
                    id: profile._id,
                    currentPassword: profile.currentPassword, 
                    newPassword: profile.password,            
                    tel: profile.tel,
                    email: profile.email
                })

                setIsEdit(false);
                setProfile(prev => ({ ...prev, currentPassword: '' })); 
                onProfile(); 
                alert('프로필 수정 완료.');

            }catch(error){
                console.error('비밀번호 검증 or update 오류', error)
                
                if (error.response && error.response.status === 401) {
                    alert('현재 비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
                } else {
                    alert('비밀번호가 다릅니다.');
                }
            }
            

        }
        //모하영 탈퇴 버튼 추가 3월 30일
        const onUserDel = async (user) =>{
            const ok = window.confirm(
                '회원 탈퇴 시 모든 정보가 영구 삭제 됩니다.\n 정말 탈퇴하시겠습니까?'
            )
            if (!ok) return
            try{
                await profileService.deleteProfile(profile._id)
                //localStorage 정리
                localStorage.removeItem('userId')
                localStorage.removeItem('user')

                localStorage.removeItem(`notified_${loginUser}_approved`)
                localStorage.removeItem(`notified_${loginUser}_rejected`)

                alert('탈퇴가 완료 되었습니다.')
                window.location.href = '/' //메인으로 이동 + 새로고침
            }catch (err) {
                console.log('탈퇴 오류', err)
                alert('탈퇴 중 오류가 발생했습니다.')
            }
            
        }
    const onData = async () => {
        try {
            const res = await reviewService.getReview(loginUser)
            console.log('응답 확인:', res)  // 응답이 되는지 확인하기 위한 코딩임 필요는 없음
            setUsers(res) 
        } catch(err) {
            console.error(err)
            setUsers([])
            }
        }

        const onDel=async (item) => {
        await reviewService.deleteReview(item._id)
        onData()
        alert('리뷰가 삭제되었습니다.')
    }

        const onProfile = async () => {
           try {
        const res = await profileService.getProfile(loginUser)
        console.log('getProfile 응답:',res)
        if(res){
        setProfile(res)
        }
    } catch(err) {
        console.error(err)
        setProfile({})
            }
        }

        const onBookmark = async () => {
           try {
        const res = await bookmarkService.getBookmarks(loginUser)
        console.log('getbookmark 응답:',res)
        if(res){
        setBookmark(res)
        }
    } catch(err) {
        console.error(err)
        setBookmark({})
            }
        }


    const changeInput = (evt) => {
        //이메일에 한글 입력 방지
    const { value, name } = evt.target;
    if(name === 'email' && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)){
        alert('이메일에 한글은 입력할 수 없습니다');
        return;
    }
    setProfile({ ...profile, [name]: value })
};

        
        
    return (
        <div className='mypage-wrapper'>
         
         {
            toast &&(
                <div className={`toast-notification toast-${toast.type}`}>
                    <span>{toast.message}</span>
                    <button onClick={()=>setToast(null)}>✕</button>
                </div>
            )
         }

            <div className='mypage-body'>
            
            {/* <Link to="/login">
            <button>로그인</button>
            </Link>
            <Link to="/board">
            <button>자유게시판</button>
            </Link> */}


            <aside className="mypage-sidebar">
            <div className="profile-card">    
            <h3 className='profile-card-title'>프로필</h3>
            
            <UserMyPageProfile profile={profile} onEdit={onEdit} isEdit={isEdit} changeInput={changeInput} loginUser={loginUser}/>
            <div className='profile-actions'>
           {isEdit
            ? <>
                <button className='btn btn-primary' onClick={onUpdate}>저장</button>
                <button className='btn btn-outline' onClick={() => { setIsEdit(false); setProfile({ ...profile, currentPassword: '' }); }}>취소</button>
              </>
            : <button className='btn btn-primary' onClick={() => setIsEdit(true)}>정보 수정</button>            
        }
        
       
        {/* 등업 상태에 따라서 실시간으로 버튼 상태 변경이 되는것  */}
        {request?.status === 'pending' ? (
            <button onClick={()=> navigate('/mypage/levelup-check')}>등업 확인하기</button>
        ) : request?.status === 'rejected' ? (
            <button onClick={()=> navigate('/mypage/levelup-check')}>등업 확인하기</button>
        ) : request?.status === 'approved' ? (
            <span>등업 완료! 재로그인 시 반영됩니다.</span>
        ) : (
            <button className='btn btn2' onClick={() => navigate('/mypage/levelup-check')}>등업 신청</button>
        )}
         <button className='btn btn3' onClick={onUserDel}>회원 탈퇴</button>

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
        </div>
    );
};

export default UserMyPage;