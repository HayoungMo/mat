import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import UserMyPageBookmarkList from './UserMyPageBookmarkList';
import * as bookmarkService from '../../services/bookmarkService';
import { useBookmark } from '../../contexts/BookmarkContext';

const UserMyPageBookmark = ({onSelectPlace}) => {
   
    const [isEdit,setIsEdit] = useState(false)
    const [currnet,setCurrent] =useState({})
    const [isShow,setIsShow] =useState(false)

    const {bookmarks, onDel} = useBookmark();

    

 
       
    return (
        <div className='Customer'>            
            <UserMyPageBookmarkList onDel={onDel} users={bookmarks}  onSelectPlace = {onSelectPlace}/>
        </div>
    );
};

export default UserMyPageBookmark;