import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import articleService from '../../services/articleServices';
import CityAdd from '../../cityHome/CityAdd';
import style from './CityMyhome.css'

const CityMyhome = ({ loginUser }) => {

    const [articles, setArticles] = useState([])
    const [cityName, setCityName] = useState('')
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] =useState(1)
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            // cityName fetch
            const res = await fetch(`/api/upgrade`)
            const data = await res.json()
            const myRequest = data.find(item => item.userId === loginUser && item.status === 'approved')
            if (myRequest) setCityName(myRequest.cityName)

            // 내 글 fetch
            const articles = await articleService.getArticle()
            const myArticles = articles.filter(item => item.userId === loginUser)
            setArticles(myArticles)
        }
        fetchData()
    }, [loginUser])

    const onAdd = async (article, images) => {
        await articleService.addArticle(article, images)
        const res = await articleService.getArticle()
        setArticles(res.filter(item => item.userId === loginUser))
    }

    const onDel = async (item) => {
        if (!window.confirm('삭제하시겠습니까?')) return
        await articleService.deleteArticle(item._id)
        setArticles(articles.filter(a => a._id !== item._id))
        alert('삭제 완료!')
    }

    const onEdit = (item) => {
        navigate(`/city/${item.cityName}/article/edit/${item._id}`)
    }

    const onView = (item) => {
        navigate(`/city/${item.cityName}/article/${item._id}`)
    }

    const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지의 마지막 인덱스
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지의 첫 번째 인덱스
    const currentArticles = articles.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에 보여줄 배열 자르기
    const totalPages = Math.ceil(articles.length / itemsPerPage); // 전체 페이지 수 계산

    // 페이지 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="myhome-container">
            <h3>여기에 내 정보나 블로그 소개가 간단하게 생길 수도 있습니다.</h3>
            <CityAdd onAdd={onAdd} loginUser={loginUser} cityNameProp={cityName}/>
            
            <div className="article-list-section">
                <h3 className="section-title">내 글 목록</h3>
                
                <div className="table-container">
                    <div className="table-header">
                        <div className="col-title">기사 제목</div>
                        <div className="col-date">작성일</div>
                        <div className="col-action">관리</div>
                    </div>

                    {articles.length === 0 ? (
                        <div className="empty-state">작성한 기사가 없습니다.</div>
                    ) : (
                        <div className="table-body">
                            {/* 🌟 전체 articles 대신 잘라낸 currentArticles를 맵핑합니다 */}
                            {currentArticles.map((item) => (
                                <div className="table-row" key={item._id}>
                                    <div className="col-title title-link" onClick={() => onView(item)}>
                                        {item.title}
                                    </div>
                                    <div className="col-date">
                                        {new Date(item.sysdate).toLocaleDateString()}
                                    </div>
                                    <div className="col-action">
                                        <button className="btn-mini btn-edit" onClick={() => onEdit(item)}>수정</button>
                                        <button className="btn-mini btn-del" onClick={() => onDel(item)}>삭제</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🌟 하단 페이징 버튼 영역 추가 */}
                {totalPages > 1 && (
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button 
                                key={number} 
                                onClick={() => paginate(number)} 
                                className={`page-btn ${currentPage === number ? 'active' : ''}`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default CityMyhome;