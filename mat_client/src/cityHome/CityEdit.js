import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaTrashCan } from "react-icons/fa6";

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

        //images, __v, _id 제외하고 텍스트만 담기
        const skipKeys = ['image','__v']
        Object.entries(article).forEach(([key,value])=>{
            if(skipKeys.includes(key)) return;
            if(value == null || value === undefined) return;
            formData.append(key,value)
        })

        //새 이미지 파일 추가
        newImages.forEach(file=>{
            formData.append("images",file)
        })

        //삭제할 이미지 목록(배열 통째로 JSON 한번만)
        
        formData.append("deletedImages",JSON.stringify(deletedImages))
        

        onUpdate(article._id,formData)

        setArticle({
            userId:'',title:'',subject:'',region:'',matName:'',matTel:'',matAddr:''
        })

        navigate(`/city/${cityName}`)
    }

    return (
        <form className="editor-form" onSubmit={onSubmit}>
            <div className="editor-header">
                <h2>기사 내용 수정</h2>
                <div className="article-meta">
                    <span className="meta-item"><strong>기자명</strong> {loginUser}</span>
                    <span className="meta-divider">|</span>
                    <span className="meta-item"><strong>취재 구역</strong> {cityMap[cityName]}</span>
                </div>
            </div>

            <div className="input-row">
                <label>기사 제목</label>
                <input type='text' value={title} name='title' onChange={changeInput} placeholder="제목을 지우셨군요?" />
            </div>

            <div className="input-row">
                <label>지역</label>
                <input type='text' value={region} name='region' onChange={changeInput} placeholder="예: 연남동, 가로수길" />
            </div>

            <div className="input-row">
                <label>맛집 상호명</label>
                <input type='text' value={matName} name='matName' onChange={changeInput} />
            </div>
            
            <div className="input-row">
                <label>맛집 전화번호</label>
                <input type='text' value={matTel} name='matTel' onChange={changeInput} placeholder="예: 02-123-4567" />
            </div>
            
            <div className="input-row">
                <label>맛집 주소</label>
                <input type='text' value={matAddr} name='matAddr' onChange={changeInput} />
            </div>

            <div className="editor-body">
                <label>기사 본문</label>
                <textarea value={subject} name='subject' onChange={changeInput} placeholder="본문을 입력해주세요"></textarea>
            </div>

            <div className="input-row">
                <label>추가 첨부할 사진</label>
                <input type='file' multiple onChange={changeImage} className="file-input" />
            </div>

            {/* 🌟 기존 이미지 관리 영역 (새로 추가된 클래스) */}
            {existingImages.length > 0 && (
                <div className="existing-images-section">
                    <label>기존 첨부 사진 관리</label>
                    <div className="image-gallery">
                        {existingImages.map((image, index) => (
                            <div className="image-card" key={index}>
                                <img 
                                    src={`/uploads/${image.saveFileName}`} 
                                    alt={`첨부 이미지 ${index + 1}`} 
                                    width={300}
                                />
                                <button 
                                    type='button' 
                                    className="btn-delete-img" 
                                    onClick={() => deleteExist(image)}
                                    title="이미지 삭제"
                                >
                                   <FaTrashCan />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 하단 버튼 그룹 */}
            <div className="button-group">
                <button type="submit" className="btn-submit">기사 수정 완료</button>
                <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>작성 취소</button>
            </div>
        </form>
    );
    
};

export default CityEdit;