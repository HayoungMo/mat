import React, { useEffect, useState } from 'react';
import UserMyPageItem from './UserMyPageItem';
import UserMyPageList from './UserMyPageList';
import { Link } from 'react-router-dom';
import UserMyPageProfile from './UserMyPageProfile';
import reviewService from '../../services/reviewService';
import profileService from '../../services/profileService';

const UserMyPage = () => {

     const [users,setUsers] = useState([])
     const [profile,setProfile] = useState({})
    
        useEffect(() => {
            onData()
         },[])
        

         useEffect(() => {
            onProfle()
         },[])
        


    
    const onData = async () => {
        try {
            const res = await reviewService.getReview()
            console.log('응답 확인:', res)  // ← 구조 확인
            setUsers(Array.isArray(res) ? res : res.data || [])  // 안전하게
        } catch(err) {
            console.error(err)
            setUsers([])
            }
        }

        const onProfle = async () => {

           try {
        const res = await profileService.getProfile()
        // 배열로 오면 첫 번째 요소만, 객체로 오면 그대로
        setProfile(Array.isArray(res) ? res[0] : res.data?.[0] ?? res.data ?? res)
    } catch(err) {
        console.error(err)
        setProfile({})
            }
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
            <UserMyPageProfile profile={profile}/>
            <button>정보 수정</button>
            
            <UserMyPageList users={users}/>
            <h4>북마크</h4>
            {/*<UserMyPageBookmark/>*/}
        </div>
    );
};

export default UserMyPage;