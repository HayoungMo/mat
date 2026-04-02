import React, { useEffect, useState } from 'react';
import UserMyPageItem from './UserMyPageItem';

const UserMyPageList = ({users,onDel}) => {

    const [page,setPage]=useState(1)
    const itemPerPage = 5

    const totalPage = Math.ceil(users.length / itemPerPage)

    useEffect(() => {
        if (page > totalPage){
            setPage(totalPage || 1)
        }
    },[users, totalPage, page])

    const startIndex = (page - 1) * itemPerPage
    const currentItems = users.slice(startIndex, startIndex + itemPerPage)


   return (
        <div>
            <h2 className='users'></h2>
            <table className='mypage-table'>
                <colgroup>
                <col className='w1'/>
                <col className='w2'/>
                <col className='w3'/>
                </colgroup>
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>별점</th>
                        <th>게시일</th>
                        <th>삭제하기</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0
                    ? <tr><td colSpan='3'>게시글이 없습니다.</td></tr>
                    :
                       currentItems.map(item=><UserMyPageItem key={item._id} item={item} onDel={onDel}/>)
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

export default UserMyPageList;