import { Link, Routes, Route} from 'react-router-dom';
import MainPage from './main/MainPage';
import MapPage from './map/MapPage';
import SearchPage from './totSearch/SearchPage';
import LoginPage from './login/LoginPage';
import MyPage from './myPage/MyPage';
import Board from './board/boardList/Board';
import React, { useState,useEffect } from 'react'; // ★ React와 useState 추가
import CityAll from './cityHome/CityAll';

function App() {

  // 추가된 코드: 로그인 유저 상태 (세션 유지용)
  const [loginUser, setLoginUser] = useState(localStorage.getItem('userId'));

  //모하영: loginUser 상태가 바뀔 때마다 로컬 스토리지와 동기화 되는 코드 입니다
  useEffect(()=>{
    if (loginUser){
      //로그인을 하거나 변경되면 스토리지에도 덮어쓰게 끔
      localStorage.setItem('userId',loginUser);
    }else{
      //로그아웃 시(setLoginUser(null) 등) 스토리지에서도 삭제 하게함
      localStorage.removeItem('userId');
    }
 }, [loginUser]);

  return (
    <div>
      <p>
        <Link to='/'><button>메인</button></Link>
        <Link to='/map'><button>지도</button></Link>
        <Link to='/search'><button>검색</button></Link>
        {/* 추가된코드 */}
        <Link to='/login'><button>{loginUser ? `${loginUser}님` : '로그인'}</button></Link>
        <Link to='/mypage'><button>마이 페이지</button></Link>
        <Link to='/city'><button>지역 모음</button></Link>
        <Link to='/board'><button>게시판</button></Link>
      </p>

      <Routes>
        <Route path="/" element={<MainPage loginUser={loginUser} setLoginUser={setLoginUser}/>} exact></Route>
        <Route path="/map" element={<MapPage loginUser={loginUser} setLoginUser={setLoginUser}/>} ></Route>
        <Route path="/search" element={<SearchPage loginUser={loginUser} setLoginUser={setLoginUser}/>} ></Route>
        <Route path="/login" element={<LoginPage loginUser={loginUser} setLoginUser={setLoginUser} />} ></Route>
        {/* 팀원 로그인정보 전달코드 */}
        <Route path="/mypage" element={<MyPage loginUser={loginUser} setLoginUser={setLoginUser} />} ></Route> <Route path="/city/*" element={<CityAll/>} ></Route>
        <Route path="/board" element={<Board loginUser={loginUser} setLoginUser={setLoginUser} />} ></Route>
      </Routes>
    </div>
  );
}

export default App;
