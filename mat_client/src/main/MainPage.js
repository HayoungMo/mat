import React, { useEffect, useRef, useState } from 'react';
import Seoul from '../asset/Test2.js'
import data from '../asset/matRestaurant.json'
import MapPage from '../map/MapPage.js';

const MainPage = () => {

  const [selectedGu, setSelectedGu] = useState("");

  const handleGuSelect = (guName) => {
    console.log("1. 버튼 클릭됨:", guName);
    setSelectedGu(guName);
  }

  //선택된 구를 데이터에서 가져와서 리스트에 담기
  const externalKeyword = selectedGu ? `${selectedGu} 맛집` : "";
  const [list, setList] = useState([]);
  
 
  console.log("3. externalKeyword:", externalKeyword);


  //25개의 구 데이터
  //한글패치
  const guMap = {
  "Dobong-gu": "도봉구",
  "Dongdaemun-gu" : "동대문구",
  "Dongjak-gu" : "동작구",
  "Gangnam-gu": "강남구",
  "Eunpyeong-gu":"연평구",
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
    <div>
      <div>
        <div style={{display:'flex', justifyContent:'center'}}>
          <input type='text' placeholder='검색' style={{width:'300px', height:'30px'}}/>
        </div>
      
      
        <div style={{ display: 'flex', paddingTop : "50px"}}>
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
        
      
          <div style={{ display: 'none' }}>
            <MapPage setList={setList}
          
            externalKeyword={selectedGu ? `${selectedGu} 맛집` : ""}/>
          </div>

          <div className='listwrap' style={{ width:"500px"}}>
            <div className='listTitle' >맛집리스트</div>
            <hr/>
            {/* 버튼을 누르면 각 구에 해당하는 값 세팅 */}
            <div style={{alignItems:"center"}}>
                <button onClick={() => handleGuSelect("강남구")}>강남</button>
                <button onClick={() => handleGuSelect("용산구")}>용산</button>
                <button onClick={() => handleGuSelect("마포구")}>마포</button>
                <button onClick={() => handleGuSelect("동작구")}>동작</button>
                <button onClick={() => handleGuSelect("중구")}>중구</button>
            </div>
            <div className="" style={{
                    top: '10px',         
                    left: '500px',         
                    width: '300px',       // 너비 조절
                    maxHeight: '500px',   
                    overflowY: 'auto', //넘어가면 조절
                    background: 'rgba(255, 255, 255, 0.9)', // 살짝 투명한 흰색
                    padding: '15px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    zIndex: 10,           
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)' // 그림자를 주면 더 입체적임
                }}>
                  {/* 리스트 반복해서 데이터 출력 */}
            {list.map((item, index) =>(
              <div key={index}>
                <div>{item.place_name}</div>
                <div>{item.category_name}</div>
                <div>{item.address_name}</div>
                <span style={{color: "#888" }}>{item.phone}</span>
                <hr/>
              </div>
                ))}
            {list.length === 0 && (
              <div className="empty-msg">데이터 없음</div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
      
  );
};

export default MainPage;