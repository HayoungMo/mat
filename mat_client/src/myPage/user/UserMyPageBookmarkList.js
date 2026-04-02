import React, { useEffect, useState } from 'react';
import UserMyPageBookmarkItem from './UserMyPageBookmarkItem';
import { useBookmark } from '../../contexts/BookmarkContext';

const UserMyPageBookmarkList = ({onSelectPlace}) => {
    const {bookmarks, onDel} = useBookmark();

     const [page,setPage]=useState(1)
        const itemPerPage = 5
    
        const totalPage = Math.ceil(bookmarks.length / itemPerPage)
    
        useEffect(() => {
            if (page > totalPage){
                setPage(totalPage || 1)
            }
        },[bookmarks, totalPage, page])
    
        const startIndex = (page - 1) * itemPerPage
        const currentItems = bookmarks.slice(startIndex, startIndex + itemPerPage)
   
    return (
        <div>
            <h2 className='users'></h2>
            <table className='mypage-table'>
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
                        <th>삭제</th>

                    </tr>
                </thead>
                <tbody>

                    
                    {
                        bookmarks.length === 0
                        ? <tr><td colSpan='3'>저장된 북마크가 없습니다.</td></tr>
                        :
                       currentItems.map(item=><UserMyPageBookmarkItem key={item._id} item={item}
                         onSelectPlace={onSelectPlace}/>)
                    }
                </tbody>
            </table>

            {totalPage > 1 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    {Array.from({ length: totalPage }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => setPage(num)}
                            style={{
                                margin: '0 5px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: page === num ? '2px solid #6D1E2A' : '1px solid #ccc',
                                background: page === num ? '#6D1E2A' : '#fff',
                                color: page === num ? '#fff' : '#333',
                                cursor: 'pointer'
                            }}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                 )}


        </div>
    );
};

export default UserMyPageBookmarkList;