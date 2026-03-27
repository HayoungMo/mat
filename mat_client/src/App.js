import { Link, Routes, Route} from 'react-router-dom';
import MainPage from './main/MainPage';
import MapPage from './map/MapPage';
import SearchPage from './totSearch/SearchPage';
import LoginPage from './login/LoginPage';
import MyPage from './myPage/MyPage';
//import CityHome from './myPage/cityUser/CityPage';
import Board from './board/boardList/Board';
import React, { useState } from 'react'; // ★ React와 useState 추가
import Notice from './login/Notice';

function App() {

  // 추가된 코드: 로그인 유저 상태 (세션 유지용)
  const [loginUser, setLoginUser] = useState(localStorage.getItem('userId'));
  const [step,setStep] = useState(0)

  return (
    <div>
      <p>
        <Link to='/notice'><button>공지사항</button></Link>
        <Link to='/'><button>메인</button></Link>
        <Link to='/map'><button>지도</button></Link>
        <Link to='/search'><button>검색</button></Link>
        {/* 추가된코드 */}
        <Link to='/login'><button>{loginUser ? `${loginUser}님` : '로그인'}</button></Link>
        <Link to='/mypage'><button>마이 페이지</button></Link>
        {/* <Link to='/cityhome'><button>지역 모음</button></Link> */}
        <Link to='/board'><button>게시판</button></Link>
      </p>

      <Routes>
        <Route path="/" element={<MainPage/>} exact></Route>
        <Route path="/map" element={<MapPage/>} ></Route>
        <Route path="/search" element={<SearchPage/>} ></Route>
        <Route path="/login" element={<LoginPage loginUser={loginUser} setLoginUser={setLoginUser} setStep={setStep}/>} ></Route>
        <Route path="/notice" element={<Notice loginUser={loginUser} setStep={setStep} />} ></Route>
        {/* 팀원 로그인정보 전달코드 */}
        <Route path="/mypage" element={<MyPage loginUser={loginUser} />} ></Route>
        {/* <Route path="/cityhome" element={<CityHome/>} ></Route> */}
        <Route path="/board" element={<Board loginUser={loginUser} />} ></Route>
      </Routes>
    </div>
  );
}

export default App;
