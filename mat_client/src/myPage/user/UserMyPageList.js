import React from 'react';
import UserMyPageItem from './UserMyPageItem';

const UserMyPageList = ({users,onDel}) => {


   return (
        <div>
            <h2 className='users'>내가 쓴 글</h2>
            <table>
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
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0
                    ? <tr><td colSpan='3'>게시글이 없습니다.</td></tr>
                    :
                        users.map(item=><UserMyPageItem key={item._id} item={item} onDel={onDel}/>)
                    }
                </tbody>
            </table>
        </div>
    );
};

export default UserMyPageList;