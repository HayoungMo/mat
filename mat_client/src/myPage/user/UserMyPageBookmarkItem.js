import React from 'react';

const UserMyPageBookmarkItem = ({item}) => {
    const {_id,matName,matTel,matAddr,createAt} = item
    return (
        <div>
            <td>{matName}</td>
            <td>{matTel}</td>
            <td>{matAddr}</td>
            <td>{createAt}</td>
            <td>
            </td>
        </div>
    );
};

export default UserMyPageBookmarkItem;