import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CityEdit = ({onUpdate,setIsEdit,loginUser}) => {

    const {id} =useParams()
    const {cityName} =useParams()
    const navigate = useNavigate()

    const [article,setArticle] = useState(null) 
    const [existingImages,setExistingImages] = useState([])
    const [deletedImages,setDeletedImages] = useState([])
    const [newImages,setNewImages] =useState([])

    //데이터 가져오기 
    useEffect(()=>{
        const fetchData= async()=>{
            try{
            const res = await axios.get(`/api/article/${id}`)
            setArticle(res.data)
            }catch(error){
                console.log(error)
            }
        }

        if(id) fetchData()
    
    },[id])

    //이미지 세팅 
    useEffect(()=>{
        if(article){
            setExistingImages(article.images || [])
        }
    },[article])

    if(!article) return <div> 로딩중... </div>;

    const {
    userId = loginUser,
    title = '',
    subject = '',
    region = '',
    matName = '',
    matTel = '',
    matAddr = ''
          } = article
  
    const changeInput=(evt)=>{
        const{value,name} = evt.target
        setArticle({
            ...article,
            [name]:value
        })
    }

    // 블로그 이름(이라고 쓰고 지역구, 데이터 처리용)
    const cityMap = {
        Gangnam: '강남구',
        Yongsan: '용산구',
        Dongjak: '동작구',
        Mapo: '마포구',
        Jung: '중구'
    }

    const changeImage=(evt)=>{
        const files = Array.from(evt.target.files)
        setNewImages(files)
    }

    //존재하던 이미지 삭제
    const deleteExist =(img)=>{
        setDeletedImages(prev=>[...prev,img.saveFileName])
        setExistingImages(prev=>
            prev.filter(i=>i.saveFileName !== img.saveFileName)
        )
    }

    //새 이미지 삭제 (쓰진 않음)
    const deleteNew =(index)=>{
        setNewImages(prev=>prev.filter((_,i)=> i !==index))
    }

    const onSubmit=(evt)=>{

        evt.preventDefault()

        const formData = new FormData()

        Object.entries(article).forEach(([key,value])=>{
            formData.append(key,value)
        })

        newImages.forEach(file=>{
            formData.append("images",file)
        })

        deletedImages.forEach(img=>{
            formData.append("deletedImages",JSON.stringify(img))
        })

        onUpdate(article._id,formData)

        setArticle({
            userId:'',title:'',subject:'',region:'',matName:'',matTel:'',matAddr:''
        })

        navigate(`/city/${cityName}`)
    }


    return (
            <form onSubmit={onSubmit}>
            <h2>수정: {title} </h2>
            <p>
                <label>아이디</label>
                <span>{loginUser}</span>
            </p>
            <p>
                <label>구</label>
                <span>{cityMap[cityName]}</span>
            </p>
            <p>
                <label>제목</label>
                <input type='text' value={title} name='title' onChange={changeInput}></input>
            </p>
            <p>
                <label>내용</label>
                <textarea value={subject} name='subject' onChange={changeInput}></textarea>
            </p>
            <p>
                <label>지역</label>
                <input type='text' value={region} name='region' onChange={changeInput}></input>
            </p>
            <p>
                <label>맛집 이름</label>
                <input type='text' value={matName} name='matName' onChange={changeInput}></input>
            </p>
            
            <p>
                <label>맛집 전화번호</label>
                <input type='text' value={matTel} name='matTel' onChange={changeInput}></input>
            </p>
            
            <p>
                <label>맛집 주소</label>
                <input type='text' value={matAddr} name='matAddr' onChange={changeInput}></input>
            </p>
            
            <p>
                <label>사진</label>
                <input type='file' multiple onChange={changeImage}/>
            </p>

        <h3>기존 이미지</h3>
        <div style={{display: 'flex',gap: '10px'}}>
            {existingImages.map((image,index)=>(
                <div key={index}>
                    <img 
                    src={`http://localhost:4000/uploads/${image.saveFileName}`} width='100'
                    />
                    <button onClick={()=>deleteExist(image)}>삭제</button>
                </div>
            ))}
        </div>
            <p>
                <button>수정</button>
                <button type='button' onClick={()=>navigate(-1)}>취소</button>
            </p>
        </form>
    );
};

export default CityEdit;