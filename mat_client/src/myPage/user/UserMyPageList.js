import React from 'react';
import UserMyPageItem from './UserMyPageItem';

const UserMyPageList = ({users}) => {
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
                        
                        <th>번호</th>
                        <th>제목</th>
                        <th>별점</th>
                        <th>게시일</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(item=><UserMyPageItem key={item.id} item={item}/>)
                    }
                </tbody>
            </table>
        </div>
    );
};

export default UserMyPageList;