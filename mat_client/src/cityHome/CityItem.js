import React from 'react';

const CityItem = ({item,onDel,onEdit}) => {

    const {no,image,title,matName} = item

    return (
        <tr>
            <td>{no}</td>
            <td><img src={`http://localhost:4000/uploads/${item.images[0]?.saveFileName}`} alt={matName}/></td>
            <td>{title}</td>
            <td>{matName}</td>
            <td>
                <button onClick={()=>onEdit(item)}>수정</button>
                <button onClick={()=>onDel(item)}>삭제</button>
            </td>
            <hr/>
        </tr>
    );
};

export default CityItem;