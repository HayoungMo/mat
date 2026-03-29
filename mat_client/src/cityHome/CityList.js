import React from 'react';
import CityItem from './CityItem';

const CityList = ({articles,onDel,onEdit}) => {
    return (
        <div>
            <h2>칼럼 리스트</h2>
            <table>
                <colgroup>
                <col/>
                <col/>
                <col/>
                </colgroup>
            <thead>
                <tr>
                    <th>no</th>
                    <th>이미지</th>
                    <th>제목</th>
                    <th>맛집</th>
                </tr>
            </thead>
            <tbody>
            {
                articles.map(item=><CityItem key={item.id} item={item} onDel={onDel} onEdit={onEdit}/>)
            }
            </tbody>
            </table>
            
        </div>
    );
};

export default CityList;