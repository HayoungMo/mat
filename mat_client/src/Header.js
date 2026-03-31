import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import SearchItem from "./totSearch/SearchItem";

const Header = ({loginUser}) => {
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
        <header style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
            <nav>
                <Link to='/'><button>메인</button></Link>
                <Link to='/map'><button>지도</button></Link>
                <Link to='/search'><button>검색</button></Link>
                {/* 추가된코드 */}
                <Link to='/login'><button>{loginUser ? `${loginUser}님` : '로그인'}</button></Link>
                <Link to='/mypage'><button>마이 페이지</button></Link>
                <Link to='/city'><button>블로그 홈</button></Link>
                <Link to='/board'><button>게시판</button></Link>
            </nav>

        {/* 검색 영역 */}
        <div style={{ position: 'relative', marginTop: '10px' }}>
            <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="미리보기 검색"
        />
        <button onClick={handleSearch}>검색</button>
        {/* 미리보기 */}
            {showSlide && previewList.length > 0 && (
                <div className="preview-slide" style={{
                    position: 'absolute', background: 'white', border: '1px solid #ddd', 
                    zIndex: 100, width: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                {previewList.map(item => (
                    <div key={item._id} onClick={() => setShowSlide(false)}>
                        <SearchItem item={item} keyword={inputText} />
                    </div>
                ))}
            </div>
            )}
            </div>
        </header>
    )
}

export default Header;