import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {searchKeyword} from '../services/SearchMapService.js';
import axios from 'axios';
import style from './CitAdd.css'

const CityAdd = ({onAdd,loginUser,cityNameProp}) => {

    const {cityName: cityNameParam} = useParams()
    const cityName = cityNameProp || cityNameParam 
    console.log('cityNameProp:', cityNameProp)
    console.log('cityNameParam:', cityNameParam)
    console.log('cityName:', cityName)
    
    useEffect(()=>{
        if(cityName){
            setArticle(prev=>({
                ...prev,
                cityName: cityName
            }))
        }
    },[cityName])

    const [article,setArticle] = useState({
        //userId는 나중에 삭제
        placeId: '',
        userId:loginUser,
        cityName:cityName,
        title:'',
        subject:'',
        region:'',
        matName:'',
        matTel:'',
        matAddr:'',
        lat : '',
        lng : ''
    })

    const cityMap = {
        Gangnam: '강남구',
        Yongsan: '용산구',
        Dongjak: '동작구',
        Mapo: '마포구',
        Jung: '중구'
    }

    const {placeId, title,subject,region,matName,matTel,matAddr}=article
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
            try {
                searchKeyword(value, (data) => {
                    setResult(data);
                });
            } catch (error) {
                console.error(error);
                alert("검색 기능을 불러오는 중 오류가 발생했습니다.");
            }
        }
    }

    const handleCancel = () =>{
        if(!window.confirm('작성 중인 기사 내용이 모두 사라집니다. 정말 취소하시겠습니까?')) return

        setArticle({
            placeId: '',
            userId: loginUser,
            cityName: cityName,
            title: '',
            subject: '',
            region: '',
            matName: '',
            matTel: '',
            matAddr: '',
            lat: '',
            lng: ''
        })

        setResult([])
        setSelected(null)

        setImages([])
    }
    const handleSelect = (item) => {
        setSelected(item);
        setResult([]);
        setArticle({
            ...article,
            placeId : item.id,
            matName: item.place_name,
            matTel: item.phone,
            matAddr: item.address_name,
            lat : item.lat,
            lng : item.lng
        });
    };
    


    const onSubmit = async(evt)=>{
        evt.preventDefault()
        if(!loginUser || !cityName ||!title || !subject || !region) return

        //글 이 두개 저장되는 이유
        // try{
        //     await axios.post("/api/article", article)
        // }catch(e){
        //     console.log(e)
        // }
        console.log(article)
        
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
        <form className="editor-form" onSubmit={onSubmit}>
            <div className="editor-header">
                <h2>맛집 탐방 기사 작성</h2>
                {/* 아이디와 구를 나란히 배치하는 메타 정보 영역 */}
                <div className="article-meta">
                    <span className="meta-item"><strong>기자명</strong> {loginUser}</span>
                    <span className="meta-divider">|</span>
                    <span className="meta-item"><strong>취재 구역</strong> {cityMap[cityName]}</span>
                </div>
            </div>

            <div className="input-row">
                <label>기사 제목</label>
                <input type='text' value={title} name='title' onChange={changeInput} placeholder="제목을 입력하세요" />
            </div>

            <div className="input-row">
                <label>지역</label>
                <input type='text' value={region} name='region' onChange={changeInput} placeholder="예: 연남동, 가로수길" />
            </div>

            <div className="input-row">
                <label>맛집 상호명</label>
                <input type='text' value={matName} name='matName' onChange={changeInput} autoComplete='off' placeholder="상호명을 검색하세요" />
                
                {/* 검색 결과 리스트 */}
                <div className="search-dropdown">
                    <ul>
                        {res.length === 0 && !selected && matName && (
                            <li className="no-result">검색결과가 없습니다.</li>
                        )}
                        {res.map((item, index)=> (
                            <li key={index} onClick={()=>handleSelect(item)}>
                                <div className="place-name">{item.place_name}</div>
                                <div className="place-addr">{item.address_name}</div>
                            </li>
                        ))}
                    </ul>
                    
                    {selected && (
                        <div className="selected-info">
                            <p><strong>상호:</strong> {selected.place_name}</p>
                            <p><strong>위치:</strong> {selected.address_name}</p>
                            <p><strong>연락처:</strong> {selected.phone || '-'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 기사 작성 텍스트 에디터 영역 */}
            <div className="editor-body">
                <label>기사 본문</label>
                <textarea value={subject} name='subject' onChange={changeInput} placeholder="생생한 맛집 후기를 기사 형식으로 작성해주세요..."></textarea>
            </div>

            <div className="input-row">
                <label>취재 사진 첨부</label>
                <input type='file' multiple onChange={changeImage} className="file-input" />
            </div>

            {/* 작게 우측 정렬된 버튼 그룹 */}
            <div className="button-group">
                <button type="submit" className="btn-submit">기사 송고</button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>작성 취소</button>
            </div>
        </form>
    );
};

export default CityAdd;