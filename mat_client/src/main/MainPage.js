import React, { useEffect, useMemo, useRef, useState } from 'react';
import Seoul from '../asset/SeoulMap.js'
import MapPage from '../map/MapPage.js';
import { Link, useNavigate } from 'react-router-dom';
import articleServices from '../services/articleServices.js';
import axios from 'axios';
import './Main.css'
import './AboutUs.js'
import AboutUs from './AboutUs.js';
import Footer from '../Footer.js';

const FEATURED_ITEMS = [
  {
    id: 1,
    large: true,
    emoji: '🥩',
    tag: '이달의 픽',
    title: '강강술래 청담점',
    addr : "서울 강남구 청담동 125-165",
    desc: '청담동 한복판에서 만나는 정통 한우 갈비. 두툼하게 잘린 고기가 숯불 위에서 노릇하게 익어가는 순간, 진짜 미식의 의미를 알게 됩니다.',
    area: '강남구',
    cityId : 'Gangnam',
    category: '한식 · 갈비',
  },
  {
    id: 2,
    large: false,
    tag: '카페',
    title: '바밀스톤커피',
    desc: '',
    cityId : 'Gangnam',
    area: '강남구',
    category: '카페',
  },
  {
    id: 3,
    large: false,
    tag: '점심 추천',
    title: '반포식스 논현점',
    desc: '',
    cityId : 'Gangnam',
    area: '강남구',
    category: '아시아음식',
  },
  {
    id: 4,
    large: false,
    tag: '저녁 추천',
    title: '리북집 논현직영점',
    desc: '',
    cityId : 'Gangnam',
    area: '강남구',
    category: '한식 · 보쌈',
  },
];




const MainPage = ({loginUser, setLoginUser, setLoginInfo}) => {
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
            alert("해당 맛집의 칼럼이 없습니다");
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


    <div className='mainContainer' style={{

      position: 'sticky',
      top: 0,
      zIndex: 1,
      backgroundColor: '#ffffff', 
    
    }}  >

      <div className="heroHeadline">
        <h1>서울의 <em>진짜 맛</em>을 찾아서</h1>
        <span className="heroSub">Seoul Restaurant Guide</span>
      </div>


      
    
      {/* ── 레이어 1: 지도 + 리스트 (뒤에 고정) ── */}
      <div style={{             
        
        top: 0,
        height: '600px',
        zIndex: 10,
        
        }}>
        <div className='mainInner'>

          <div className='SeoulCont'>
            <Seoul
              width="500" height="500"
              onClick={(e) => {
                if (e.target.tagName === "path") {
                  setSelectedGu(guMap[e.target.id]);
                  console.log(e.target.id);
                }
              }}
            />
          </div>

          <div className='listwrap' style={{ width: "500px" }}>
            <div className='listTitle'>맛집리스트</div>
            <hr className='divider'/>
            <div className="btnArea" style={{ alignItems: "center" }}>
              <button onClick={() => handleGuSelect("강남구")}>강남</button>
              <button onClick={() => handleGuSelect("용산구")}>용산</button>
              <button onClick={() => handleGuSelect("마포구")}>마포</button>
              <button onClick={() => handleGuSelect("동작구")}>동작</button>
              <button onClick={() => handleGuSelect("중구")}>중구</button>
            </div>

            <div className="listItem">
              {list
              .filter(item=> item.place_name)
              .map((item, index) => (
              
                <div key={index} className='list-row'>
                  <div className="list-info">
                  <div className="place-title" onClick={() => moveArticle(item)}>{item.place_name}</div>
                  <div className="place-address">{item.address_name}</div>
                  <div className="place-category">{item.category_name}</div>
                  
                  <span style={{ color: "#888" }} className="place-phone">{item.phone}</span>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="empty-msg">지도에서 구를 선택하거나 버튼을 눌러보세요</div>
              )}
            </div>

            <div style={{ display: 'none' }}>
              <MapPage
                setList={setList}
                externalKeyword={selectedGu ? `${selectedGu} 맛집` : ""}
              />
            </div>
          </div>

        </div>
      </div>
      {/* ── 레이어 1 끝 ── */}

      {/* ══════════════════════════════════
          ★ 새 섹션: 오늘의 추천 맛집
      ══════════════════════════════════ */}
      <section className="featuredSection">
        <div className="sectionHeader">
          <h2>에디터가 고른 <em>이달의 맛집</em></h2>
          <span className="sectionTag">Editor's Pick</span>
        </div>

        <div className="featuredGrid">
          {list
          .filter(item => item.place_name)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4)
          .map((item) => (
            
            <div
              key={item.id}
              className={`featuredCard${item.large ? ' large' : ''}`}
              onClick={() =>moveArticle(item)}
            >
              <div className="featuredCardBody">
                <div className="featuredCardTag">{item.category_name}</div>
                <div className="featuredCardTitle">{item.place_name}</div>
                <div className="featuredCardDesc">{item.address_name}</div>
                <div className="featuredCardMeta">
                  <span>{item.address_name}</span>
                  <span className="dot" />
                  <span>{item.category_name}</span>
                </div>
              </div>
            </div>

          ))}
        </div>
      </section>
      {/* ── 추천 섹션 끝 ── */}

       <div style={{
        position: 'relative',
        zIndex: 10,
        borderRadius: '0 0',
        overflow: 'hidden',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
        marginTop: "0",
        

      }}>
      
      
              

      {/* ── 레이어 2: AboutUs (위로 올라오며 덮음) ── */}
     
        <AboutUs />
      </div>
      {/* ── 레이어 2 끝 ── */}


      <Footer/>
    </div>
  );
};

export default MainPage;