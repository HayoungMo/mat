import React, { useRef, useState } from 'react';
import {searchKeyword} from '../services/SearchMapService.js';

const CityAdd = ({onAdd}) => {

    const nameRef = useRef()

    const [article,setArticle] = useState({
        //userId는 나중에 삭제
        userId:'',cityName:'',title:'',subject:'',region:'',matName:'',matTel:'',matAddr:''
    })

    const [res, setResult] = useState([]);//검색 결과
    const [selected, setSelected] = useState(null); //선택된 항목

    const {userId,cityName,title,subject,region,matName,matTel,matAddr}=article

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
        if(!userId || !cityName ||!title || !subject || !region) return

        onAdd(article,images)

        setArticle({
            userId:'',cityName:'',title:'',subject:'',region:'',matName:'',matTel:'',matAddr:''
        })

        nameRef.current.focus()
    }

    return (
        <form onSubmit={onSubmit}>
            <h2>글 쓰기</h2>
            <p>
                <label>아이디</label>
                <input type='text' value={userId} name='userId' onChange={changeInput} ref={nameRef}></input>
            </p>
            <p>
                <label>구역</label>
                <input type='radio' value='Gangnam' name='cityName' onChange={changeInput} checked={cityName==="Gangnam"}/>강남구
                <input type='radio' value='Yongsan' name='cityName' onChange={changeInput} checked={cityName==="Yongsan"}/>용산구
                <input type='radio' value='Dongjak' name='cityName' onChange={changeInput} checked={cityName==="Dongjak"}/>동작구
                <input type='radio' value='Mapo' name='cityName' onChange={changeInput} checked={cityName==="Mapo"}/>마포구
                <input type='radio' value='Jung' name='cityName' onChange={changeInput} checked={cityName==="Jung"}/>중구
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