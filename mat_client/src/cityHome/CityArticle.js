import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import articleServices from '../services/articleServices';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark} from '../services/bookmarkService';

const CityArticle = ({loginUser,loginInfo}) => {

    const navigate = useNavigate()
    const {id} = useParams()
    const {cityName} =useParams()
    const [data,setData] = useState(null)
    const [bookmarked, setBookmarked] = useState(false);
    const [reviews, setReviews] =useState([])
    const [reviewForm, setReviewForm] =useState({content: '',rating:5})

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

    if(!data) return <div>로딩중... </div>

    const {no,title,subject,userId,matAddr,matName,matTel} = data

    const canEdit = loginInfo?.role === 'city' && loginUser === userId
    const alreadyReviewed = reviews.some(r=>r.userId === loginUser)
    const canReview = loginInfo?.role === 'user' && !alreadyReviewed

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
                const data = await toggleBookmark(userId, Article, no); 
                console.log("결과:", data);
                setBookmarked(data.bookmarked);
                } catch (err) {
                    console.error('북마크 저장 실패', err);
                }
            }
    return (
        <div>
            <h2>{title}</h2> 
            <div
                    onClick={(e) => {
                        e.stopPropagation();
                        // 토글 로직: 기존 객체를 복사하고 현재 ID 값만 반전
                        handleBookmarkToggle(data);
                    }}>
                    
                        <span style={{ color: bookmarked ? '#ffc107' : '#ccc',
                            cursor:'pointer'
                         }}>
                            {data ? "★" : "☆"}
                        </span>
                </div>
            <p>{subject}</p>

            <p>작성자: {userId}</p>       
            <p>지역: {cityMap[cityName]}</p>
            <p>맛집: {matName}</p>       
            <p>Tel: {matTel}</p>       
            <p>주소: {matAddr}</p>    

            <h4>이미지!</h4>
            {
                data.images?.map((image,index)=>(
                    <img
                        key={index}
                        src={`/uploads/${image.saveFileName}`}
                        width={200}
                        alt={title}
                    />
                ))
            }   

            <p>
                {canEdit && <button onClick={onEdit}>수정</button>}
                {canEdit && <button onClick={onDel}>삭제</button>}
                                
            </p>

            <hr/>
            <h3>리뷰</h3>

        {
            canReview? (
            <div>
                <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}>
                    <option value={5}>⭐⭐⭐⭐⭐</option>
                    <option value={4}>⭐⭐⭐⭐</option>
                    <option value={3}>⭐⭐⭐</option>
                    <option value={2}>⭐⭐</option>
                    <option value={1}>⭐</option>
                </select>
            <input 
            value={reviewForm.content} 
            onChange={e => setReviewForm({...reviewForm, content: e.target.value})}
            placeholder='리뷰를 작성해주세요'
            />
            <button onClick={onReviewSubmit}>등록</button>
            </div>
            )
            :
            (
            <p>
            {!loginUser && '로그인 후 리뷰를 작성할 수 있습니다.'}
            {loginUser && loginInfo?.role !== 'user' && '일반 회원만 리뷰를 작성할 수 있습니다.'}
            {alreadyReviewed && '이미 리뷰를 작성하셨습니다.'}
            </p>
            )
        }
            <ul>
                {reviews.map(review => (
                <li key={review._id}>
                <span>{'⭐'.repeat(review.rating)}</span>
                <span>{review.userId}</span>
                <span>{review.content}</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                {loginUser === review.userId && 
                    <button onClick={()=> onReviewDel(review._id)}>삭제</button>
                }
                </li>
                ))}
            </ul>

        </div>
    );
};

export default CityArticle;