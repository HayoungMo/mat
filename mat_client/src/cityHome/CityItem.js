import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark } from '../services/bookmarkService';
import { searchKeyword } from '../services/SearchMapService';
import axios from 'axios';
import { TiStarOutline, TiStarFullOutline  } from "react-icons/ti";
import { TbMapPinFilled } from "react-icons/tb";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const CityItem = ({ item, displayNo, onDel, onEdit, loginUser, loginInfo }) => {
    const navigate = useNavigate(); // 페이지 이동을 위해 추가
    const { no, title, matName, userId } = item;
    const canEdit = loginInfo?.role === 'city' && loginUser === item.userId;

    const [bookmarked, setBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 🌟 북마크 로직 (기존 코드 완벽 유지)
    const handleBookmarkToggle = async(Article) => {
        try {
            let lat = Article.lat;
            let lng = Article.lng;

            if ((!lat || !lng) && Article.matName) {
                const searchResult = await new Promise((resolve) => {
                    searchKeyword(Article.matName, (data, status) => {
                        if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
                            resolve(data[0]); // 첫 번째 결과 사용
                        } else {
                            resolve(null);
                        }
                    });
                });
                if (searchResult) {
                    lat = searchResult.y; // 카카오는 y가 lat
                    lng = searchResult.x; // 카카오는 x가 lng
                }
            }
            const bookdata = await toggleBookmark(loginUser, {...Article, lat, lng}, no); 
            setBookmarked(bookdata.bookmarked);
        } catch (err) {
            console.error('북마크 저장 실패', err);
        } finally {
            setIsLoading(false); 
        }
    }

    useEffect(() => {
        const checkBookmarked = async () => {
            if (!loginUser || !no) return;
            try {
                const res = await axios.get(`/api/bookmarks/checkArticle?userId=${loginUser}&articleNo=${no}`);
                setBookmarked(res.data.bookmarked);
            } catch (err) {
                console.error('북마크 확인 실패', err);
            }
        };
        checkBookmarked();
    }, [loginUser, no]);

    // 🌟 렌더링 영역 (테이블 구조 -> 매거진 카드 구조로 완벽 교체!)
    return (
        <div className="column-card">
            
            {/* 📸 1. 썸네일 이미지 영역 (클릭 시 이동) */}
            <div 
                className="column-thumbnail" 
                onClick={() => navigate(`/city/${item.cityName}/article/${item._id}`)}
            >
                {item.images && item.images.length > 0 ? (
                    <img src={`/uploads/${item.images[0]?.saveFileName}`} alt={matName} />
                ) : (
                    <div className="no-image-box">No Image</div>
                )}
            </div>

            {/* 📝 2. 칼럼 텍스트 영역 */}
            <div className="column-text-content">
                {/* 상단: 번호, 제목, 북마크 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, marginRight: '15px' }}>
                        <h2 
                            className="column-title" 
                            onClick={() => navigate(`/city/${item.cityName}/article/${item._id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span style={{ color: '#8a2130', marginRight: '8px' }}>{displayNo}.</span>
                            {title}
                        </h2>
                        <p className="column-excerpt" style={{ fontWeight: '600' }}><TbMapPinFilled /> {matName}</p>
                    </div>

                    {/* 북마크 별 아이콘 (노란색에서 매거진 컨셉에 맞게 버건디 포인트로 변경) */}
                    {loginInfo?.role !== 'city' && (
                        <div 
                            onClick={(e) => { e.stopPropagation(); handleBookmarkToggle(item); }}
                            style={{ cursor: 'pointer', display: 'inline-flex' }} // div에 커서 스타일 추가
                        >
                            {bookmarked ? (
                                <StarIcon sx={{ color: '#f6e055', fontSize: 40, transition: 'color 0.2s' }} />
                            ) : (
                                <StarBorderIcon sx={{ color: '#ddd', fontSize: 40, transition: 'color 0.2s' }} />
                            )}
                        </div>
                    )}
                </div>
                
                {/* 하단: 메타 정보 (기자, 작성일) & 관리 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
                    <div className="column-meta">
                        <span className="meta-author">{userId} 기자</span>
                    </div>

                    {/* 작성자 전용 수정/삭제 버튼 */}
                    {canEdit && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Tooltip title="수정">
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                    sx={{ color: '#093c71' }}>
                                    <EditIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="삭제">
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDel(item); }}
                                    sx={{ color: '#8a2130' }}>
                                    <DeleteIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default CityItem;