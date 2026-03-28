import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const CityAdd = ({onAdd,loginUser}) => {

 
    const {cityName} = useParams()

    const [article,setArticle] = useState({
        //userId는 나중에 삭제
        userId:loginUser,
        cityName:cityName,
        title:'',
        subject:'',
        region:'',
        matName:'',
        matTel:'',
        matAddr:''
    })

    const cityMap = {
        Gangnam: '강남구',
        Yongsan: '용산구',
        Dongjak: '동작구',
        Mapo: '마포구',
        Jung: '중구'
    }

    const {title,subject,region,matName,matTel,matAddr}=article

    const [images,setImages]=useState([])

    const changeImage=(evt)=>{
        const files = Array.from(evt.target.files)
        setImages(files)
    }

    const changeInput=(evt)=>{
        const {value,name}=evt.target
        setArticle({
            ...article,
            [name]:value
        })
    }

    const onSubmit =(evt)=>{
        evt.preventDefault()
        if(!loginUser || !cityName ||!title || !subject || !region) return

        onAdd(article,images)

        setArticle({
            userId:loginUser,
            cityName:cityName,
            title:'',
            subject:'',
            region:'',
            matName:'',
            matTel:'',
            matAddr:''
        })

    }

    return (
        <form onSubmit={onSubmit}>
            <h2>글 쓰기</h2>
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

            <p>
                <button>추가</button>
                <button>취소</button>
            </p>
        </form>
    );
};

export default CityAdd;