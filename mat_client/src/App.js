import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import MainPage from './main/MainPage';
import MapPage from './map/MapPage';
import SearchPage from './totSearch/SearchPage';
import LoginPage from './login/LoginPage';
import MyPage from './myPage/MyPage';
import Board from './board/boardList/Board';
import React, { useState, useEffect } from 'react';
import CityAll from './cityHome/CityAll';
import Header from './Header';
import Footer from './Footer';
import Loading from './Loading';

function App() {

  const [loginUser, setLoginUser] = useState(localStorage.getItem('userId'));
  const [loginInfo, setLoginInfo] = useState(() => {
    const saved = localStorage.getItem('user');
    try { return saved ? JSON.parse(saved) : null; }
    catch { return null; }
  });

  useEffect(() => {
    if (loginUser) { localStorage.setItem('userId', loginUser); }
    else { localStorage.removeItem('userId'); }
    if (loginInfo) { localStorage.setItem('user', JSON.stringify(loginInfo)); }
    else { localStorage.removeItem('user'); }
  }, [loginUser, loginInfo]);

  // 헤더용 로그아웃 함수
  const onLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setLoginUser(null);
    setLoginInfo(null);
    alert("로그아웃 되었습니다");
  };

  return (
    <div>
      <Header loginUser={loginUser} onLogout={onLogout} />

      <Routes>
        <Route path="/" element={<MainPage loginUser={loginUser} setLoginUser={setLoginUser} />} exact />
        <Route path="/map" element={<MapPage loginUser={loginUser} setLoginUser={setLoginUser} />} />
        <Route path="/search" element={<SearchPage loginUser={loginUser} setLoginUser={setLoginUser} />} />
        <Route path="/login" element={<LoginPage loginUser={loginUser} loginInfo={loginInfo} setLoginInfo={setLoginInfo} setLoginUser={setLoginUser} />} />
        <Route path="/mypage/*" element={loginUser ?
          <MyPage loginUser={loginUser} setLoginUser={setLoginUser} loginInfo={loginInfo} setLoginInfo={setLoginInfo}/> :
          <LoginPage setLoginUser={setLoginUser} setLoginInfo={setLoginInfo} />
        } />
        <Route path="/city/*" element={<CityAll loginUser={loginUser} loginInfo={loginInfo} />} />
        <Route path="/board/*" element={<Board loginUser={loginUser} setLoginUser={setLoginUser} />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;