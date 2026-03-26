import React, { useEffect, useState } from 'react';
import UserMyPageItem from './UserMyPageItem';
import articleService from '../../services/articleService';
import UserMyPageList from './UserMyPageList';
import { Link } from 'react-router-dom';
import UserMyPageProfile from './UserMyPageProfile';

const UserMyPage = () => {

     const [users,setUsers] = useState([])
        const [isEdit,setIsEdit] = useState(false)
        const [currnet,setCurrent] =useState({})
        const [msg,setMsg] =useState('')
        const [isShow,setIsShow] =useState(false)
    
        useEffect(() => {
            onData()
        },[])
    
        const onData = async() => {
             const res = await articleService.getArticle()
            setUsers(res)
        } 
        
        const onShow =(msg)=>{
            setMsg(msg)
            setIsShow(true)
        }
    return (
        <div>
            <h2><a href='/'>로고</a></h2>
            <h2>상단바 메뉴</h2>
            <h3>프로필</h3>
            {/* <UserMyPageProfile/> */}
            <Link to="/login">
            <button>로그인</button>
            </Link>
            <Link to="/board">
            <button>자유게시판</button>
            </Link>
            <UserMyPageList users={users}/>
            <h4>북마크</h4>
        </div>
    );
};

export default UserMyPage;