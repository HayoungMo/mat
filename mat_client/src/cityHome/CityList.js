import React from 'react';
import CityItem from './CityItem';

const CityList = ({articles, onDel, onEdit, loginUser, loginInfo, currentPage, itemsPerPage}) => {
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
            articles.map((item, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
            
            return(
                <CityItem key={item._id} item={item} displayNo={globalIndex}
                onDel={onDel} onEdit={onEdit} loginUser={loginUser} loginInfo={loginInfo}/>
                  );
                })
            }
            </tbody>
            </table>
            
        </div>
    );
};

export default CityList;