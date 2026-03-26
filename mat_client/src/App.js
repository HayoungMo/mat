import { Link, Routes, Route} from 'react-router-dom';
import MainPage from './main/MainPage';
import MapPage from './map/MapPage';
import SearchPage from './totSearch/SearchPage';
import LoginPage from './login/LoginPage';
import MyPage from './myPage/MyPage';
import Board from './board/boardList/Board';
import CityAll from './cityHome/CityAll';

function App() {

  
  return (
    <div>
      <p>
        <Link to='/'><button>메인</button></Link>
        <Link to='/map'><button>지도</button></Link>
        <Link to='/search'><button>검색</button></Link>
        <Link to='/login'><button>로그인</button></Link>
        <Link to='/mypage'><button>마이 페이지</button></Link>
        <Link to='/city'><button>지역 모음</button></Link>
        <Link to='/board'><button>게시판</button></Link>
      

      </p>
      <Routes>
        <Route path="/" element={<MainPage/>} exact></Route>
        <Route path="/map" element={<MapPage/>} ></Route>
        <Route path="/search" element={<SearchPage/>} ></Route>
        <Route path="/login" element={<LoginPage/>} ></Route>
        <Route path="/mypage" element={<MyPage/>} ></Route>
        <Route path="/city/*" element={<CityAll/>} ></Route>
        <Route path="/board" element={<Board/>} ></Route>
      </Routes>
    </div>
  );
}

export default App;