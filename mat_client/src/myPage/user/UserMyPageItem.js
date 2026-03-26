import React from 'react';

const UserMyPageItem = ({item}) => {
  
    const {_id,userId,aNo,content,rating,createdAt} =item


    return (
        <tr>
            <td>{aNo}</td>
            <td>{userId}</td>
            <td>{content}</td>
            <td>{rating}</td>
            <td>{createdAt?.slice(0,10)}</td>
        </tr>
    );
};

export default UserMyPageItem;