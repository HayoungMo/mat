import './search.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import SearchItem from './SearchItem';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const SearchPage = () => {

//주소 창의 파라미터를 읽고 쓰기 위한 도구
const navigate = useNavigate();
const [searchParams, setSearchParams] = useSearchParams();

//사용자가 입력한 검색어,주소창에서 'q'라는 이름의 값 (예: ?q=자연)
const urlKeyword = searchParams.get('q') || '';

//상태 관리 (한글입력 방해 금지를 위한것)
const [inputText, setInputText] = useState(urlKeyword);
const [list, setList] = useState([]);
//페이징 처리
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // 한 페이지에 5개씩

//전체 데이터에서 제목/본문 결과를 미리 분류해서 합친다.
const allTitleMatches = list.filter(item =>
    item.title.toLowerCase().includes(urlKeyword.toLowerCase())
);
const allSubjectMatches = list.filter(item => 
    !item.title.toLowerCase().includes(urlKeyword.toLowerCase()) && 
    item.subject.toLowerCase().includes(urlKeyword.toLowerCase())
);

//제목 우선
const sortedTotalList = [...allTitleMatches, ...allSubjectMatches];


const onSearch = async (query) => {
        if (!query.trim()) {
            setList([]);
            return;
        }
        try {
            const res = await axios.get(`/api/article?keyword=${query}`);
            setList(res.data || []); ;//배열에 담아서 넘기는거, list가 안오면 에러가 나지 않게 방어를 해주는 역할 뒤가 || []
        } catch (err) {
            console.error("검색 에러:", err);
            setList([]);
        }
    };
    

// 주소창의 keyword가 바뀔 때마다 자동으로 검색 실행
// 뒤로 가기를 해서 주소가 바뀌면 이 useEffect가 작동하여 결과를 복구
   useEffect(() => {
        setInputText(urlKeyword);
        onSearch(urlKeyword);
        setCurrentPage(1);
    }, [urlKeyword]);

    //실시간 검색 및 주소창 업데이트
    useEffect(() => {

        if (inputText === urlKeyword) return;

        const timer = setTimeout(() => {
            setSearchParams({ q: inputText });
        }, 300);// 300ms 후에 주소창 딱 한 번 업데이트

        return () => clearTimeout(timer);
    }, [inputText, setSearchParams, urlKeyword]);

//페이징 데이터 자르는 로직
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = sortedTotalList.slice(indexOfFirstItem, indexOfLastItem);

//잘라낸 데이터에서 제목/ 본문 분류하기
//제목에 키워드가 포함된 걸 빼기
const titleMatches = currentItems.filter(item => 
        item.title.toLowerCase().includes(urlKeyword.toLowerCase())
);
//본문에만 키워드가 포함된걸 빼기(중복방지)
const subjectMatches = currentItems.filter(item => 
        !item.title.toLowerCase().includes(urlKeyword.toLowerCase()) && 
        item.subject.toLowerCase().includes(urlKeyword.toLowerCase())
);

const totalPages = Math.ceil(sortedTotalList.length / itemsPerPage);

return (
    <div className="search-container">
        <button
                onClick={() => navigate(-1)}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    color: '#8a2130', fontWeight: '600', fontSize: '14px',
                    padding: '8px 0', marginBottom: '16px'
                }}
                 >
                <ArrowBackIosNewIcon style={{ fontSize: '16px' }} />
                뒤로가기
            </button>
        {/* <SearchBar keyword={inputText} setKeyword={setInputText} onSearch={() => onSearch(inputText)}/> */}
            {/* 검색 결과 출력 */}
           {urlKeyword && list.length > 0 ? (
                <>
                    {/* 제목 검색 결과 */}
                    {titleMatches.length > 0 && (
                        <div className="section">
                            <h3>"{urlKeyword}" 제목 포함 결과</h3>
                            {titleMatches.map(item => (
                                <SearchItem key={item._id} item={item} keyword={urlKeyword}/>
                            ))}
                        </div>
                    )}

                    {/* 본문 검색 결과 */}
                    {subjectMatches.length > 0 && (
                        <div className="section" style={{marginTop: '30px'}}>
                            <h3>"{urlKeyword}" 본문 포함 결과</h3>
                            {subjectMatches.map(item => (
                                <SearchItem key={item._id} item={item} keyword={urlKeyword}/>
                            ))}
                        </div>
                    )}

                    {/* 페이징 버튼 UI */}
                    {totalPages > 1 && (
                        <div className="paging-wrap">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>이전</button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button 
                                    key={i + 1} 
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={currentPage === i + 1 ? 'active' : ''}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>다음</button>
                        </div>
                    )}
                </>
            ) : (
                urlKeyword && <p style={{marginTop: '20px'}}>검색 결과가 없습니다.</p>
            )}
        </div>
    );
};

export default SearchPage;

// //filter 대상 배열 list, filter 안에서 비교할 텍스트 : item.title(또는 실제 필드명), includes에 넣을 검색어 keyword
// const filterSearch = list.filter((item)=>{
//     //필터링한 대상은 api에서 받아온 list다.
//     return item.list.replace(" ","").toLocaleLowerCase().includes(list.toLocaleLowerCase().replace(" ",""));
//     //includes 함수는 배열의 특정 요소가 포함하는지 판별해주는 boolean 타입으로, 입력한 검색어를 true&false로 나눠준다. 그리고 이 함수는 대소문자를 인식하기때문에 to~~~case 함수로 입력값을 대소문자 동일 시켰다.
//     //replace를 사용해서 공백을 모두 지운후 띄어쓰기, 붙여쓰기해도 검색에 이상없게 만들었다.
//라우터에 걸러줄 코딩을 만들어뒀기때문에 필터는 피료없다.
// });