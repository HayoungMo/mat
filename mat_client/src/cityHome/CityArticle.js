import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import articleServices from '../services/articleServices';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark} from '../services/bookmarkService';

const CityArticle = () => {

    const navigate = useNavigate()
    const {id} = useParams()
    const {cityName} =useParams()
    const [data,setData] = useState(null)
    const [bookmarked, setBookmarked] = useState(false);

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
                        src={`http://localhost:4000/uploads/${image.saveFileName}`}
                        width={200}
                        alt={title}
                    />
                ))
            }   

            <p>
                <button onClick={onEdit}>수정</button>
                <button onClick={onDel}>삭제</button>
                
            </p>
        </div>
    );
};

export default CityArticle;