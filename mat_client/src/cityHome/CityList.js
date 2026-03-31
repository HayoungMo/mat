import React from 'react';
import CityItem from './CityItem';

const CityList = ({articles, onDel, onEdit, loginUser, loginInfo, currentPage, itemsPerPage}) => {
    return (
        <div className="column-list-wrapper">
            {articles.length === 0 ? (
                <div className="empty-column">아직 발행된 칼럼이 없습니다.</div>
            ) : (
                articles.map((item, index) => {
                    // 번호 계산은 그대로 유지합니다.
                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                    
                    return(
                        <CityItem 
                            key={item._id} 
                            item={item} 
                            displayNo={globalIndex}
                            onDel={onDel} 
                            onEdit={onEdit} 
                            loginUser={loginUser} 
                            loginInfo={loginInfo}
                        />
                    );
                })
            )}
        </div>
    );
};

export default CityList;