import React from 'react';

const UserMyPageBookmarkItem = ({item,loginUser,onDel}) => {
    const {_id,matName,matTel,matAddr,createAt} = item
    return (
        <div>
            <td>{matName}</td>
            <td>{matTel}</td>
            <td>{matAddr}</td>
            <td>{createAt}</td>
            <td>
                <button onClick={()=>onDel(item)}>삭제</button>
            </td>
        </div>
    );
};

export default UserMyPageBookmarkItem;