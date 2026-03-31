import React, { useEffect, useMemo, useRef, useState } from 'react';
import Seoul from '../asset/SeoulMap.js'
import MapPage from '../map/MapPage.js';
import { useNavigate } from 'react-router-dom';
import articleServices from '../services/articleServices.js';
import axios from 'axios';
import './Main.css'


const MainPage = () => {
  //총합검색어
  const [keyword, setKeyword] = useState('');
  const [searchList, setSearchList] = useState([]);

  const [selectedGu, setSelectedGu] = useState("");
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]); //아티클 객체 정보를 담을 배열

  const onSearch = async () => {
    if(!keyword.trim()) return;
    const res = await axios.get(`/api/article?keyword=${keyword}`);
    setSearchList(res.data || []);
  };
  const handleGuSelect = (guName) => {
    console.log("1. 버튼 클릭됨:", guName);
    setSelectedGu(guName);
  }

  //선택된 구를 데이터에서 가져와서 리스트에 담기
const externalKeyword = useMemo(() => 
    selectedGu ? `${selectedGu} 맛집` : ""
, [selectedGu]);
  const [list, setList] = useState([]);
  
 
  console.log("3. externalKeyword:", externalKeyword);

  useEffect(() => {
    const fetchArticles = async()=> {
      const res = await articleServices.getArticle();
      setArticles(res);
    }
    fetchArticles();
  },[])
//useEffect 무한 루프
 

  const moveArticle =(place) =>{

    if (!place || !articles) return;

     const found = articles.find(a =>
        a.matName === place.place_name &&
        a.matAddr === place.address_name
    );
          
        
        if(found){
          navigate(`/city/${found.cityName}/article/${found._id || found.id}`);
          return;
          
          }else{
            alert("해당 맛집의 아티클이 없습니다");
          }
  }


  //25개의 구 데이터
  //한글패치
  const guMap = {
  "Dobong-gu": "도봉구",
  "Dongdaemun-gu" : "동대문구",
  "Dongjak-gu" : "동작구",
  "Gangnam-gu": "강남구",
  "Eunpyeong-gu":"은평구",
  "Gangbuk-gu":"강북구",
  "Gangdong-gu":"강동구",
  "Gangseo-gu":"강서구",
  "Geumcheon-gu":"금천구",
  "Guro-gu":"구로구",
  "Gwanak-gu":"관악구",
  "Gwangjin-gu":"광진구",
  "Gangnam-gu":"강남구",
  "Jongno-gu":"종로구",
  "Jung-gu":"중구",
  "Jungnang-gu":"중랑구",
  "Mapo-gu":"마포구",
  "Nowon-gu":"노원구",
  "Seocho-gu":"서초구",
  "Seodaemun-gu":"서대문구",
  "Seongbuk-gu":"성북구",
  "Seongdong-gu":"성동구",
  "Songpa-gu":"송파구",
  "Yangcheon-gu":"양천구",
  "Yeongdeungpo-gu_1_":"영등포구",
  "Yongsan-gu":"용산구",
  };

  return (


    
    <div className='mainContainer'>

      <header style={{marginBottom : "30px"}}> 
          헤더 배너, 사진등
          about us(대충 소개하는 글이나 대표글)
        </header>

      <div className='mainInner'>
        

        <div className='SeoulCont'
            style={{ display: 'flex', paddingTop : "50px"}}>
            {/* path (svg파일의 path태그 클릭시) 함수실행 */}
            {/* 선택된 아이디의 이름과 같은 구 이름을 set */}
            <Seoul
              width = "600" height="600"
            
              onClick={(e)=>{
                if(e.target.tagName === "path"){
                  setSelectedGu(guMap[e.target.id]);
                  console.log(e.target.id);
                }
              }}
            />
        </div>
        
          <div className='listwrap' style={{ width:"500px"}}>
            <div className='listTitle' >
              맛집리스트
            </div>
              <hr className='divider'/>
              {/* 버튼을 누르면 각 구에 해당하는 값 세팅 */}
              <div className="btnArea" style={{alignItems:"center"}}>
                  <button onClick={() => handleGuSelect("강남구")}>강남</button>
                  <button onClick={() => handleGuSelect("용산구")}>용산</button>
                  <button onClick={() => handleGuSelect("마포구")}>마포</button>
                  <button onClick={() => handleGuSelect("동작구")}>동작</button>
                  <button onClick={() => handleGuSelect("중구")}>중구</button>
              </div>
              <div className="listItem" style={{
                   
                }}>
                  {/* 리스트 반복해서 데이터 출력 */}
              {list.map((item, index) =>(
                <div key={index}>
                  <div className="place-name" onClick={() => moveArticle(item)}>
                    {item.place_name}</div>
                  <div className="place-category">{item.category_name}</div>
                  <div className="place-address">{item.address_name}</div>
                  <span style={{color: "#888" }} className="place-phone">{item.phone}</span>
                  <hr className="item-divider"/>
                </div>
                  ))}
             

             {list.length === 0 || !list && (
              <div className="empty-msg">데이터 없음</div>
            )}
          </div>
           

          <div style={{ display: 'none' }}>
            <MapPage setList={setList}
          
            externalKeyword={selectedGu ? `${selectedGu} 맛집` : ""}/>
          </div>
        
      </div>
    </div>
    <footer>
            Footer Area
    </footer>

  </div>

  
      
  );
};

export default MainPage;