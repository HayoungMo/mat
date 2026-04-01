import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import SearchItem from "./totSearch/SearchItem";



const Header = ({loginUser,onLogout}) => {
    const navigate = useNavigate();
    const location = useLocation(); //페이지 이동 감지용
    const [inputText, setInputText] = useState('');
    const [previewList, setPreviewList] = useState([]);
    const [showSlide, setShowSlide] = useState(false);
  

    //페이지 이동하면 검색어 초기화
    useEffect(() => {
        setInputText('');
        setPreviewList([]);
        setShowSlide(false);
    },[location.pathname]);

    //실시간 보기 (3~5개)
    useEffect(() => {
        if(!inputText.trim()) {
            setPreviewList([]);
            setShowSlide(false);
            return;
        }
        const timer = setTimeout(async () => {
            const res = await axios.get(`/api/article?keyword=${inputText}`);
            setPreviewList(res.data.slice(0, 5) || []); //5개만 보여줌
            setShowSlide(true);
        },300);
        return () => clearTimeout(timer);
    },[inputText]);

    
    //엔터치면 검색 페이지로 이동하기
    const handleSearch = () => {
        if (!inputText.trim()) return;
        setShowSlide(false);
        navigate(`/search?q=${inputText}`);
    };

    return(
         <header className="auth-header">
            <div className="header-inner">
                {/* 로고 */}
                <Link to="/" className="logo-text">MAT</Link>

                {/* 네비게이션 + 검색창 묶음 (중앙) */}
                <div className="header-center">
                    <nav className="header-nav">
                        
                        <Link to="/map" className={location.pathname === '/map' ? 'active' : ''}>지도</Link>
                        <Link to="/city" className={location.pathname.startsWith('/city') ? 'active' : ''}>블로그</Link>
                        <Link to="/board" className={location.pathname === '/board' ? 'active' : ''}>게시판</Link>
                    </nav>

                    {/* 검색창 - 마우스가 벗어나면 미리보기 닫기 */}
                    <div
                        className="header-search-wrap"
                        
                    >
                        <input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            // 포커스 잃으면 200ms 후 닫기 → 그 사이 클릭 가능
                            onBlur={() => setTimeout(() => setShowSlide(false), 200)}
                            onFocus={() => { if (previewList.length > 0) setShowSlide(true); }}
                            placeholder="검색해보세요"
                            className="header-search-input"
                        />
                        <button onClick={handleSearch} className="header-search-btn">검색</button>
                        {/* 미리보기 */}
                        {showSlide && previewList.length > 0 && (
                            <div className="preview-slide">
                                {previewList.map(item => (
                                    <div key={item._id} onClick={() => {
                                        setShowSlide(false);
                                        setInputText('');
                                    }}>
                                        <SearchItem item={item} keyword={inputText} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 로그인 상태 */}
                <div className="header-right">
                    {loginUser ? (
                        <>
                            <span>{loginUser}님</span>
                            <span className="bar">|</span>
                            <Link to="/mypage">마이페이지</Link>
                            <span className="bar">|</span>
                            <span onClick={onLogout}>로그아웃</span>
                        </>
                    ) : (
                        <>
                            <Link to="/login">로그인</Link>
                            {/* <span className="bar">|</span> */}
                            {/* <Link to="/login">회원가입</Link> */}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;