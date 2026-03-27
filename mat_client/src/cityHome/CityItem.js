import React from 'react';
import {Link,Route,Routes} from 'react-router-dom'

const CityItem = ({item,onDel,onEdit}) => {

    console.log('item 전체',item)
    console.log('이미지',item.images)
    const {no,title,matName} = item

    return (
        <tr>
            {console.log("이미지")}
            <td>{no}</td>
            <td>
                <Link to={`/city/${item.cityName}/article/${item._id}`}><img src={`http://localhost:4000/uploads/${item.images[0]?.saveFileName}`} width='100' alt={matName}/>
            </Link>
            </td>
            <td><Link to={`/city/${item.cityName}/article/${item._id}`}>{title}</Link></td>
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