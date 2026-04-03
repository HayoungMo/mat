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
import ScrollButton from './ScrollButton';
import axios from 'axios';

function App() {
  const [toast, setToast] = useState(null);
  const [loginUser, setLoginUser] = useState(localStorage.getItem('userId'));
  const [loginInfo, setLoginInfo] = useState(() => {
    const saved = localStorage.getItem('user');
    try { return saved ? JSON.parse(saved) : null; }
    catch { return null; }
  });

    useEffect(() => {
    const checkSession = async () => {
        if (!loginUser) return;
        try {
            await axios.get('/api/profile/' + loginUser);
        } catch (err) {
            // 서버 응답 없으면 로그아웃 처리
            if (err.code === 'ERR_NETWORK' || err.response?.status === 404) {
                localStorage.removeItem('userId');
                localStorage.removeItem('user');
                setLoginUser(null);
                setLoginInfo(null);
            }
        }
    };
    checkSession();
}, []);


  // 헤더용 로그아웃 함수
  const onLogout = () => {
    const ok = window.confirm('정말 로그아웃 하시겠습니까?');
    if (!ok) return;
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setLoginUser(null);
    setLoginInfo(null);
    setToast({ msg: '로그아웃 되었습니다', type: 'info' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      {/* 토스트 메시지 */}
        {toast && (
            <div className="toast-message">
                {toast.msg}
            </div>
        )}
      
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
      <ScrollButton/>
      <Footer />
    </div>
  );
}

export default App;