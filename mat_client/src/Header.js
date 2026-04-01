import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchItem from "./totSearch/SearchItem";

const Header = ({ loginUser, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation(); // 페이지 이동 감지용
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
            setPreviewList(res.data.slice(0, 5) || []); // 5개만 보여줌
            setShowSlide(true);
        }, 300);
        return () => clearTimeout(timer);
    }, [inputText]);

    // 엔터치면 검색 페이지로 이동
    const handleSearch = () => {
    if (!inputText.trim()) {
        // 입력창 흔들기 효과
        const input = document.querySelector('.header-search-input');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        return;
    }
    setShowSlide(false);
    navigate(`/search?q=${inputText}`);
};

    return (
        <header className="auth-header">

            {/* 1줄: MAT 로고(좌) + 로그인정보(우) */}
            <div className="header-top">
                <Link to="/" className="logo-text">MAT</Link>
                <div className="header-right">
                    {loginUser ? (
                        <>
                            <span>{loginUser}님</span>
                            <span className="bar">|</span>
                            <span onClick={() => navigate('/mypage')}>마이페이지</span>
                            <span className="bar">|</span>
                            <span onClick={onLogout}>로그아웃</span>
                        </>
                    ) : (
                        <>
                            <Link to="/login">로그인</Link>
                        </>
                    )}
                </div>
            </div>

            {/* 2줄: 네비게이션 + 검색창 */}
            <div className="header-bottom">
                <nav className="header-nav">
                    <span
                        onClick={() => navigate('/map')}
                        className={location.pathname === '/map' ? 'active' : ''}
                    >지도</span>
                    <span
                        onClick={() => navigate('/city')}
                        className={location.pathname.startsWith('/city') ? 'active' : ''}
                    >블로그</span>
                    <span
                        onClick={() => navigate('/board')}
                        className={location.pathname === '/board' ? 'active' : ''}
                    >게시판</span>
                </nav>

                {/* 검색창 */}
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

        </header>
    );
};

export default Header;