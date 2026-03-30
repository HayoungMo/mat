import React, { useState } from 'react';
import {Link,Route,Routes} from 'react-router-dom'
import { toggleBookmark} from '../services/bookmarkService';

const CityItem = ({item,onDel,onEdit,loginUser, loginInfo}) => {

    console.log('item 전체',item)
    console.log('이미지',item.images)
    const {no,title,matName} = item

    const canEdit = loginInfo?.role === 'city' && loginUser === item.userId

    const [bookmarked, setBookmarked] = useState(false);

    const handleBookmarkToggle = async(Article) => {
            console.log("place 객체:", Article); 
            try {
            const data = await toggleBookmark(loginUser, Article, no); 
            console.log("결과:", data);
            setBookmarked(data.bookmarked);
            } catch (err) {
                console.error('북마크 저장 실패', err);
            }
        }

    return (
        <tr>
            {console.log("이미지")}
            <td>{no}</td>
            <td>
                <Link to={`/city/${item.cityName}/article/${item._id}`}><img src={`/uploads/${item.images[0]?.saveFileName}`} width='100' alt={matName}/>
            </Link>
            </td>
            <td><Link to={`/city/${item.cityName}/article/${item._id}`}>{title}</Link></td>
            <td>{matName}</td>
            <td>
                {canEdit && <button onClick={()=>onEdit(item)}>수정</button>}
                {canEdit && <button onClick={()=>onDel(item)}>삭제</button>}

                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        // 토글 로직: 기존 객체를 복사하고 현재 ID 값만 반전
                        handleBookmarkToggle(item);
                    }}>
                    
                        <span style={{ color: bookmarked ? '#ffc107' : '#ccc',
                            cursor:'pointer'
                         }}>
                            {item ? "★" : "☆"}
                        </span>
                </div>
                                
                
            </td>
            <hr/>
        </tr>
    );
};

export default CityItem;