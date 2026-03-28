import React from 'react';

const UserMyPageItem = ({item,loginUser,onEdit,onDel}) => {
  
    const {_id,userId,aNo,content,rating,createdAt} =item

    return (
        <tr>
            <td>{content}</td>
            <td>{rating}</td>
            <td>{createdAt?.slice(0,10)}</td>
            <td>
                <button onClick={()=>onDel(item)}>삭제</button>
            </td>
        </tr>
    );
};

export default UserMyPageItem;