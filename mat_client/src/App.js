import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './main/MainPage';
import MapPage from './map/MapPage';
import SearchPage from './totSearch/SearchPage';
import LoginPage from './login/LoginPage';
import UserMyPage from './myPage/user/UserMyPage';
import BoardPage from './board/BoardPage';
import CityHome from './cityHome/CityHome';
import AdminPage from './myPage/admin/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<UserMyPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/cityhome" element={<CityHome />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;