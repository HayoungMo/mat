import React, { useEffect, useState } from 'react';
import {Link,Route,Routes} from 'react-router-dom'
import { toggleBookmark} from '../services/bookmarkService';
import { searchKeyword } from '../services/SearchMapService';
import axios from 'axios';

const CityItem = ({item,onDel,onEdit,loginUser, loginInfo}) => {

    console.log('item 전체',item)
    console.log('이미지',item.images)
    const {no,title,matName, userId} = item

    const canEdit = loginInfo?.role === 'city' && loginUser === item.userId

    const [bookmarked, setBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleBookmarkToggle = async(Article) => {
                    console.log("place 객체:", Article); 
                    try {
                        let lat = Article.lat;
                        let lng = Article.lng;
    
                    if ((!lat || !lng) && Article.matName) {
                        const searchResult = await new Promise((resolve) => {
                            searchKeyword(Article.matName, (data, status) => {
                                console.log("검색결과:", data, status);
                                if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
                                    resolve(data[0]); // 첫 번째 결과 사용
                                } else {
                                    resolve(null);
                                }
                        });
                    });
                    console.log("searchResult:", searchResult);
                    if (searchResult) {
                        lat = searchResult.y; // 카카오는 y가 lat
                        lng = searchResult.x; // 카카오는 x가 lng
                       }
                    }
                    const bookdata = await toggleBookmark(loginUser, {...Article,lat,lng}, no ); 
                    console.log("결과:", bookdata);
                    setBookmarked(bookdata.bookmarked);
                    console.log("bookdata 객체:", bookdata);
                    } catch (err) {
                        console.error('북마크 저장 실패', err);
                    }finally {
                        setIsLoading(false); // ✅ 완료 후 해제
                    }
                }

                useEffect(() => {
                    console.log("체크 실행 - loginUser:", loginUser, "no:", no);
                    const checkBookmarked = async () => {
                        if (!loginUser || !no) return;
                        try {
                            const res = await axios.get(`/api/bookmarks/checkArticle?userId=${loginUser}&articleNo=${no}`);
                            console.log("북마크 체크 결과:", res.data);
                            setBookmarked(res.data.bookmarked);
                        } catch (err) {
                            console.error('북마크 확인 실패', err);
                        }
                    };
                    checkBookmarked();
                }, [loginUser, no]);

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