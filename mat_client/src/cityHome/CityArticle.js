import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import articleServices from '../services/articleServices';
import { useNavigate } from 'react-router-dom';

const CityArticle = () => {

    const navigate = useNavigate()
    const {id} = useParams()
    const [data,setData] = useState(null)

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

    const {title,subject,userId,cityName,matAddr,matName,matTel} = data

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
    return (
        <div>
            <h2>{title}</h2> 
            <p>{subject}</p>

            <p>작성자: {userId}</p>       
            <p>지역: {cityName}</p>
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