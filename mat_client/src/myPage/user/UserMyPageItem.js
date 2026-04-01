import React from 'react';
import { useNavigate } from 'react-router-dom';


// const UserMyPageItem = ({item,loginUser,onEdit,onDel}) => {
const UserMyPageItem = ({item,loginUser,onDel}) => {
  
    // const {_id,userId,aNo,content,rating,createdAt} =item
    const navigate = useNavigate();
    const {_id,aNo,content,rating,createdAt} =item;

    const goToArticle = async () => {
        try{
            const res = await fetch(`/api/article/byNo/${aNo}`);
            const article = await res.json();
            if(article && article.cityName && article._id){
                navigate(`/city/${article.cityName}/article/${article._id}`);
            } else {
                alert('해당 글을 찾을 수 없습니다');
            }
        } catch {
            alert('글 조회 실패');
        }
    };

    const renderStars = (num) => {
        const totalStars = 5;
        return "★".repeat(num).padEnd(totalStars, "☆");
    };

    

    return (
        <tr>
            <td onClick={goToArticle} 
                style={{cursor:'pointer', color:'blue', textDecoration:'underline'}}>
                {content}
            </td>
            <td className='rating-cell' style={{color:'#ffb703', fontSize:'1.2rem'}}>
                {renderStars(rating)}
            </td>
            <td>{createdAt?.slice(0,10)}</td>
            <td>
                <button className='btn btn-primary' onClick={() => onDel(item)}>삭제</button>
            </td>
        </tr>
    );
};

export default UserMyPageItem;