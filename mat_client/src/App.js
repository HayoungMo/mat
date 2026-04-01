import { Link, Routes, Route} from 'react-router-dom';
import MainPage from './main/MainPage';
import MapPage from './map/MapPage';
import SearchPage from './totSearch/SearchPage';
import LoginPage from './login/LoginPage';
import MyPage from './myPage/MyPage';
import Board from './board/boardList/Board';
import React, { useState,useEffect } from 'react'; // ★ React와 useState 추가
import CityAll from './cityHome/CityAll';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer'

function App() {

  // 추가된 코드: 로그인 유저 상태 (세션 유지용), localStorage는 브라우저에 영구 저장되는것.
  const [loginUser, setLoginUser] = useState(localStorage.getItem('userId'));
  const [loginInfo, setLoginInfo] = useState(()=>{
      const saved= localStorage.getItem('user')
      try{
        return saved ? JSON.parse(saved) : null
      }catch{
        return null
      }
  
  }
  )

     //모하영: loginUser 상태가 바뀔 때마다 로컬 스토리지와 동기화 되는 코드 입니다
  useEffect(()=>{
    if (loginUser){
        localStorage.setItem('userId', loginUser);
    } else {
        localStorage.removeItem('userId');
    }
    if (loginInfo){
        localStorage.setItem('user', JSON.stringify(loginInfo))
    } else {
        localStorage.removeItem('user')
    }
}, [loginUser, loginInfo]);

  return (
    <div>
      
      <Header loginUser={loginUser} />

      <Routes>
        <Route path="/" element={<MainPage loginUser={loginUser} setLoginUser={setLoginUser}/>} exact></Route>
        <Route path="/map" element={<MapPage loginUser={loginUser} setLoginUser={setLoginUser}/>} ></Route>
        <Route path="/search" element={<SearchPage loginUser={loginUser} setLoginUser={setLoginUser}/>} ></Route>
        <Route path="/login" element={<LoginPage loginUser={loginUser} loginInfo={loginInfo} setLoginInfo={setLoginInfo} setLoginUser={setLoginUser} />} ></Route>
        {/* 팀원 로그인정보 전달코드 */}
        <Route path="/mypage/*" element={loginUser ? 
        <MyPage loginUser={loginUser} setLoginUser={setLoginUser} loginInfo={loginInfo}/> :
        <LoginPage setLoginUser={setLoginUser} setLoginInfo={setLoginInfo}/>
        } ></Route> 
        <Route path="/city/*" element={<CityAll loginUser={loginUser} loginInfo={loginInfo}/>} ></Route>
        <Route path="/board" element={<Board loginUser={loginUser} setLoginUser={setLoginUser} setLoginInfo={setLoginInfo}/>} ></Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
