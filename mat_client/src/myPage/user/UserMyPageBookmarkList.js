import React from 'react';
import UserMyPageBookmarkItem from './UserMyPageBookmarkItem';
import { useBookmark } from '../../contexts/BookmarkContext';

const UserMyPageBookmarkList = ({onSelectPlace}) => {
    const {bookmarks, onDel} = useBookmark();
   
    return (
        <div>
            <h2 className='users'></h2>
            <table>
                <colgroup>
                <col className=''/>
                <col className=''/>
                <col className=''/>
                </colgroup>
                <thead>
                    <tr>
                        <th>맛집 이름</th>
                        <th>전화번호</th>
                        <th>주소</th>
                        <th>추가 일자</th>

                    </tr>
                </thead>
                <tbody>

                    
                    {
                        bookmarks.length === 0
                        ? <tr><td colSpan='3'>저장된 북마크가 없습니다.</td></tr>
                        :
                        bookmarks.map(item=><UserMyPageBookmarkItem key={item._id} item={item}
                         onSelectPlace={onSelectPlace}/>)
                    }
                </tbody>
            </table>
        </div>
    );
};

export default UserMyPageBookmarkList;