import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchItem from "./totSearch/SearchItem";

const Header = ({ loginUser, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [inputText, setInputText] = useState('');
    const [previewList, setPreviewList] = useState([]);
    const [showSlide, setShowSlide] = useState(false);

    // 페이지 이동하면 검색어 초기화
    useEffect(() => {
        setInputText('');
        setPreviewList([]);
        setShowSlide(false);
    }, [location.pathname]);

    // 실시간 미리보기 (5개)
    useEffect(() => {
        if (!inputText.trim()) {
            setPreviewList([]);
            setShowSlide(false);
            return;
        }
        const timer = setTimeout(async () => {
            const res = await axios.get(`/api/article?keyword=${inputText}`);
            setPreviewList(res.data.slice(0, 5) || []);
            setShowSlide(true);
        }, 300);
        return () => clearTimeout(timer);
    }, [inputText]);

    // 검색 실행
    const handleSearch = () => {
        if (!inputText.trim()) {
            const input = document.querySelector('.header-search-input');
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
            return;
        }
        setShowSlide(false);
        navigate(`/search?q=${inputText}`);
    };

    return (
    <header className="auth-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>

        {/* 1줄: MAT(중앙) + 로그인(우) onClick={(e) => e.stopPropagation()} = 네비 검색 로그인 할때 누름 방지 이벤트 버블링 막아주기*/}
        <div className="header-top" onClick={(e) => e.stopPropagation()}>
            <Link to="/" className="logo-text">MAT</Link>
            <div className="header-right"  >
                {loginUser ? (
                    <>
                        <span>{loginUser}님</span>
                        <span className="bar">|</span>
                        <span onClick={() => navigate('/mypage')}>마이페이지</span>
                        <span className="bar">|</span>
                        <span onClick={onLogout}>로그아웃</span>
                    </>
                ) : (
                    <Link to="/login">로그인</Link>
                )}
            </div>
        </div>

        {/* 2줄: 네비 + 검색 */}
        <div className="header-bottom" onClick={(e) => e.stopPropagation()}>
            <nav className="header-nav">
                <span onClick={() => navigate('/map')} className={location.pathname === '/map' ? 'active' : ''}>지도</span>
                <span onClick={() => navigate('/city')} className={location.pathname.startsWith('/city') ? 'active' : ''}>칼럼</span>
                <span onClick={() => navigate('/board')} className={location.pathname === '/board' ? 'active' : ''}>게시판</span>
            </nav>

            <div className="header-search-wrap">
                <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    onBlur={() => setTimeout(() => setShowSlide(false), 200)}
                    onFocus={() => { if (previewList.length > 0) setShowSlide(true); }}
                    placeholder="검색해보세요"
                    className="header-search-input"
                />
                <button onClick={handleSearch} className="header-search-btn">검색</button>
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

    </header>
);
};

export default Header;