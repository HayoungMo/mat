import React, { useEffect, useState } from 'react';
import UserMyPageItem from './UserMyPageItem';
import UserMyPageList from './UserMyPageList';
import { Link } from 'react-router-dom';
import UserMyPageProfile from './UserMyPageProfile';
import reviewService from '../../services/reviewService';
import profileService from '../../services/profileService';
import bookmarkService from '../../services/bookmarkService';
import UserProfileUpdate from './UserProfileUpdate';
import UserMyPageBookmark from './UserMyPageBookmark';

const UserMyPage = ({loginUser}) => {

     const [users,setUsers] = useState([])
     const [profile,setProfile] = useState({})
     const [isEdit,setIsEdit] = useState(false)
     const [current,setCurrent] =useState({})
     const [bookmark,setBookmark] = useState([])

     console.log('loginUser 확인',loginUser)

    
        useEffect(() => {
            onData()
             onProfile()
         },[])
        

         
        
         const onEdit = (user) => {
            console.log('onEdit 받은 데이터:',user)
            setCurrent(user)
            setIsEdit(true)
         }

        const onUpdate= async (user) =>{
            console.log('onUpdate 호출됨: ',profile)
            setIsEdit(false)
            await profileService.updateProfile(profile)
            onProfile()
            alert('프로필 수정 완료.')
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
    const { value, name } = evt.target
    setProfile({ ...profile, [name]: value })
}

        
        
    return (
        <div>
            <h2><a href='/'>로고</a></h2>
            <h2>상단바 메뉴</h2>
            <Link to="/login">
            <button>로그인</button>
            </Link>
            <Link to="/board">
            <button>자유게시판</button>
            </Link>

            <h3>프로필</h3>
            <UserMyPageProfile profile={profile} onEdit={onEdit} isEdit={isEdit} changeInput={changeInput} loginUser={loginUser}/>
           {isEdit
            ? <>
                <button onClick={onUpdate}>저장</button>
                <button onClick={() => setIsEdit(false)}>취소</button>
              </>
            : <button onClick={() => setIsEdit(true)}>정보 수정</button>
        }
            
            <div>
            <UserMyPageList users={users} onDel={onDel}/>
            </div>
            
            
            <h1>북마크</h1>
            <UserMyPageBookmark onDel={onDel} loginUser={loginUser}/>
        </div>
    );
};

export default UserMyPage;