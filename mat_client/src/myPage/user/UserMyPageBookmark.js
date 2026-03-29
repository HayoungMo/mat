import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import UserMyPageBookmarkList from './UserMyPageBookmarkList';
import * as bookmarkService from '../../services/bookmarkService';

const UserMyPageBookmark = ({loginUser,onDel}) => {
   const [users,setUsers] = useState([])
    const [isEdit,setIsEdit] = useState(false)
    const [currnet,setCurrent] =useState({})
    const [isShow,setIsShow] =useState(false)

    useEffect(() => {
        onData()
    },[])

    const onData = async() => {
        const res = await bookmarkService.getBookmarks(loginUser)
        setUsers(res)
    }
       
    return (
        <div className='Customer'>            
            <UserMyPageBookmarkList onDel={onDel} users={users}/>
        </div>
    );
};

export default UserMyPageBookmark;