import React from 'react';


const UserMyPageItem = ({item,loginUser,onEdit,onDel}) => {
  
    const {_id,userId,aNo,content,rating,createdAt} =item

    const renderStars = (num) => {
        const totalStars = 5;
        return "★".repeat(num).padEnd(totalStars, "☆");
    };

    

    return (
        
        <tr>
            <td>{content}</td>
            <td className='rating-cell' style={{color:' #ffb703',fontSize:'1.2rem'}}>
                {renderStars(rating)}
            </td>
            <td>{createdAt?.slice(0,10)}</td>
            <td>
                <button className='btn btn-primary' onClick={()=>onDel(item)}>삭제</button>
            </td>
        </tr>
        
    
        
    );
};

export default UserMyPageItem;