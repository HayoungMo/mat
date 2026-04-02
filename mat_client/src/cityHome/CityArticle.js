import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import articleServices from '../services/articleServices';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark} from '../services/bookmarkService';
import { searchKeyword } from '../services/SearchMapService';
import style from './CityArticle.css'
import { TiStarOutline, TiStarFullOutline  } from "react-icons/ti";
import Loading from '../Loading';


const CityArticle = ({loginUser,loginInfo}) => {

    const navigate = useNavigate()
    const {id} = useParams()
    const {cityName} =useParams()
    const [data,setData] = useState(null)
    const [bookmarked, setBookmarked] = useState(false);
    const [reviews, setReviews] =useState([])
    const [reviewForm, setReviewForm] =useState({content: '',rating:5})
    // const {placeId} = data

    useEffect(()=>{
        if(data?.no){
            fetchReviews()
        }
    },[data])

    const fetchReviews = async()=>{
        const res = await axios.get(`/api/review/article/${data.no}`)
        setReviews(res.data)
    }

    const onReviewSubmit = async()=>{
        if(!loginUser){
            alert('로그인이 필요합니다')
            return
        }
        if(!reviewForm.content){
            alert('내용을 입력해주세요!')
            return
        }

        await axios.post(`/api/review/${loginUser}`,{
            userId: loginUser,
            aNo: data.no,
            content: reviewForm.content,
            rating: reviewForm.rating
        })

        setReviewForm({content:'', rating:5})
        fetchReviews()
    }

    const onReviewDel = async(reviewId)=>{
        if(!window.confirm('삭제하시겠습니까?')) return
        await axios.delete('/api/review',{data:{id:reviewId}})
        fetchReviews()
    }

    useEffect(()=>{
        const fetchData = async ()=>{
         try{
            const res = await axios.get(`/api/article/${id}`)
            setData(res.data)
         }catch (error){
            console.log(error)
         }
        }

        if (id){
            fetchData()
        }

    },[id])

            useEffect(() => {
            const checkBookmarked = async () => {
                if (!loginUser || !data?.no) return;
                try {
                    const res = await axios.get(`/api/bookmarks/checkArticle?userId=${loginUser}&articleNo=${data.no}`);
                    setBookmarked(res.data.bookmarked);
                } catch (err) {
                    console.error('북마크 확인 실패', err);
                }
                };
                checkBookmarked();
            }, [loginUser, data]);

    if(!data) return <Loading/>

    const {no,title,subject,userId,matAddr,matName,matTel} = data

    const canEdit = loginInfo?.role === 'city' && loginUser === userId
    const alreadyReviewed = reviews.some(r=>r.userId === loginUser)
    const canReview = loginInfo?.role === 'user' && !alreadyReviewed
    const heroImage = data.images && data.images.length > 0 ? data.images[0] : null
    const restImages = data.images && data.images.length > 1 ? data.images.slice(1) : []

     const cityMap = {
        Gangnam: '강남구',
        Yongsan: '용산구',
        Dongjak: '동작구',
        Mapo: '마포구',
        Jung: '중구'
    }

    const onDel = async ()=>{
        try{

            await articleServices.deleteArticle(id)
            alert('삭제 완료')
            navigate(`/city/${cityName}`)
        }catch(error){
            console.log(error)
        }
    }

    const onEdit = async ()=>{
        navigate(`/city/${cityName}/article/edit/${id}`)
    }

    
    
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
                }
            }

    return (
        <div className="article-read-container">
            {/* 1. 기사 헤더 영역 (제목 및 북마크) */}
            <div className="article-read-header">
                <h2 className="article-title">{title}</h2>
                
                {loginInfo?.role !== 'city' && (
                    <div 
                        className="bookmark-btn" 
                        onClick={(e) => { e.stopPropagation(); handleBookmarkToggle(data); }}
                        title={bookmarked ? "북마크 해제" : "북마크 추가"}
                    >
                        <span style={{ color: bookmarked ? '#f6e055' : '#cccccc' }}>
                            {bookmarked ? <TiStarFullOutline /> : <TiStarOutline />}
                        </span>
                    </div>
                )}
            </div>

            {/* 2. 기사 메타 및 맛집 정보 박스 */}
            <div className="article-info-box">
                <div className="info-group">
                    <span className="info-label">기자</span>
                    <span className="info-value">{userId}</span>
                    <span className="info-divider">|</span>
                    <span className="info-label">취재 지역</span>
                    <span className="info-value">{cityMap[cityName]}</span>
                </div>
                <div className="info-group restaurant-details">
                    <p><strong>상호명:</strong> {matName}</p>
                    <p><strong>연락처:</strong> {matTel || '정보 없음'}</p>
                    <p><strong>위치:</strong> {matAddr}</p>
                </div>
            </div>

            {/* 🌟 3. 대표 이미지 (Hero Image) 영역: 본문 시작 전 맨 위에 크게 배치 */}
            {heroImage && (
                <div className="article-hero-image">
                    <img 
                        src={`/uploads/${heroImage.saveFileName}`} 
                        alt="대표 취재 사진" 
                    />
                </div>
            )}

            {/* 4. 기사 본문 영역 */}
            <div className="article-content-body">
                <div className="content-text">
                    {subject}
                </div>

                {/* 🌟 5. 나머지 추가 사진 갤러리: 본문 아래에 배치 */}
                {restImages.length > 0 && (
                    <div className="content-images">
                        {restImages.map((image, index) => (
                            <img
                                key={index}
                                src={`/uploads/${image.saveFileName}`}
                                alt={`추가 사진 ${index + 1}`}
                                className="article-image"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 🌟 기사 하단 버튼 영역 (목록, 수정, 삭제) */}
            <div className="article-management">
                {/* 왼쪽: 누구나 볼 수 있는 목록 버튼 */}
                <div className="left-actions">
                    <button 
                        className="btn-list" 
                        onClick={() => navigate(`/city/${cityName}`)}
                    >
                        ← 목록으로
                    </button>
                </div>

                {/* 오른쪽: 작성자 전용 관리 버튼 */}
                {canEdit && (
                    <div className="right-actions">
                        <button className="btn-mini btn-edit" onClick={onEdit}>기사 수정</button>
                        <button className="btn-mini btn-del" onClick={onDel}>기사 삭제</button>
                    </div>
                )}
            </div>

            {/* 6. 독자 리뷰(댓글) 영역 */}
            <div className="review-section">
                <h3 className="review-title">독자 리뷰 <span className="review-count">{reviews.length}</span></h3>

                {/* 리뷰 작성 폼 */}
                {canReview ? (
                    <div className="review-form">
                        <select className="review-select" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}>
                            <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                            <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                            <option value={3}>⭐⭐⭐ (3/5)</option>
                            <option value={2}>⭐⭐ (2/5)</option>
                            <option value={1}>⭐ (1/5)</option>
                        </select>
                        <input 
                            type="text"
                            className="review-input"
                            value={reviewForm.content} 
                            onChange={e => setReviewForm({...reviewForm, content: e.target.value})}
                            placeholder="이 맛집에 대한 솔직한 평가를 남겨주세요."
                        />
                        <button className="btn-review-submit" onClick={onReviewSubmit}>등록</button>
                    </div>
                ) : (
                    <div className="review-notice">
                        {!loginUser && '로그인 후 리뷰를 작성할 수 있습니다.'}
                        {loginUser && loginInfo?.role !== 'user' && '일반 독자 회원만 리뷰를 작성할 수 있습니다.'}
                        {alreadyReviewed && '이미 이 기사에 리뷰를 남기셨습니다.'}
                    </div>
                )}

                {/* 리뷰 목록 */}
                <ul className="review-list">
                    {reviews.length === 0 ? (
                        <li className="no-review">아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!</li>
                    ) : (
                        reviews.map(review => (
                            <li className="review-item" key={review._id}>
                                <div className="review-item-header">
                                    <div className="review-meta">
                                        <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                                        <span className="review-writer">{review.userId}</span>
                                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {loginUser === review.userId && (
                                        <button className="btn-review-del" onClick={() => onReviewDel(review._id)}>삭제</button>
                                    )}
                                </div>
                                <div className="review-content">
                                    {review.content}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CityArticle;