import React from 'react';
import UserMyPageBookmarkItem from './UserMyPageBookmarkItem';

const UserMyPageBookmarkList = ({users}) => {
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
                        <th>맛집 전화번호</th>
                        <th>맛집 주소</th>
                        <th>추가 일자</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(item=><UserMyPageBookmarkItem key={item._id} item={item}/>)
                    }
                </tbody>
            </table>
        </div>
    );
};

export default UserMyPageBookmarkList;