import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {searchKeyword} from '../services/SearchMapService.js';

const CityAdd = ({onAdd,loginUser,cityNameProp}) => {

    const {cityName: cityNameParam} = useParams()
    const cityName = cityNameProp || cityNameParam 

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
    const [res, setResult] = useState([]);//검색 결과
    const [selected, setSelected] = useState(null); //선택된 항목


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
        
        if (name === 'matName') {
            if (!value) {
                setResult([]);
                return;
            }
            searchKeyword(value, (data) => { //추가된 로직
                console.log("콜백 data", data);         // 전체 구조 확인
                console.log("배열?:", Array.isArray(data)); // true/false 확인
                setResult(data); //serachKeyword 찾아가서 data 가져옴
            });
        }
    }

    const handleSelect = (item) => {
        setSelected(item);
        setResult([]);
        setArticle({
            ...article,
            matName: item.place_name
        });
    };
    


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
                <input type='text' value={matName} name='matName' onChange={changeInput} autoComplete='off'></input>
                <div>
                    <ul>
                        
                        {res.length === 0 && !selected &&(
                            <div>
                               <p>검색결과 없음</p>
                            </div>
                        )}
                        
                        {res.map((item, index)=> (
                            <li key={index} onClick={()=>handleSelect(item)}>
                            <div>{item.place_name}</div>
                            <div>{item.address_name}</div>
                            <div>{item.phone}</div>
                            </li>
                        ))}
                          
                    </ul>

                    {selected && (
                        <div>
                            <p>가게 이름: {selected.place_name}</p>
                            <p>📍 주소: {selected.address_name}</p>
                            <p>📞 전화번호: {selected.phone || '정보 없음'}</p>
                        </div>
                    )}
                </div>
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