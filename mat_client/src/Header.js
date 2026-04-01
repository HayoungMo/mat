import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import SearchItem from "./totSearch/SearchItem";



const Header = ({loginUser,onLogout}) => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [previewList, setPreviewList] = useState([]);
    const [showSlide, setShowSlide] = useState(false);
  

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
                <Link to="/" className="logo-text">MAT</Link>

                <div className="header-right-group">
                    <nav className="header-nav">
                        <Link to="/">메인</Link>
                        <Link to="/map">지도</Link>
                        <Link to="/search">검색</Link>
                        <Link to="/login">로그인</Link>
                        <Link to="/mypage">마이페이지</Link>
                        <Link to="/city">블로그</Link>
                        <Link to="/board">게시판</Link>
                    </nav>

        {/* 검색 영역 */}
           <div style={{ position: 'relative', marginLeft: '20px' }}>
                        <input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="검색어 입력"
                            className="header-search-input"
                        />
            <button onClick={handleSearch} className="header-search-btn">검색</button>
        {/* 미리보기 */}
             {showSlide && previewList.length > 0 && (
                            <div className="preview-slide">
                                {previewList.map(item => (
                                    <div key={item._id} onClick={() => setShowSlide(false)}>
                                        <SearchItem item={item} keyword={inputText} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="header-right">
                        {loginUser ? (
                            <>
                                <span>{loginUser}님</span>
                                <span className="bar">|</span>
                                <span onClick={onLogout} style={{ cursor: 'pointer' }}>로그아웃</span>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>로그인</Link>
                                <span className="bar">|</span>
                                <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>회원가입</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;