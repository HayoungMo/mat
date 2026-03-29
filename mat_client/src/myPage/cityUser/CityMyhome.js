import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import articleService from '../../services/articleServices';
import CityAdd from '../../cityHome/CityAdd';

const CityMyhome = ({ loginUser }) => {

    const [articles, setArticles] = useState([])
    const [cityName, setCityName] = useState('')
    const navigate = useNavigate()

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

    return (
        <div>
            <CityAdd onAdd={onAdd} loginUser={loginUser} cityNameProp={cityName}/>
            <h3>내가 쓴 글</h3>
            {articles.length === 0 && <p>작성한 글이 없습니다.</p>}
            <ul>
                {articles.map((item) => (
                    <li key={item._id}>
                        <span onClick={() => onView(item)} style={{cursor:'pointer'}}>
                            {item.title}
                        </span>
                        &nbsp;|&nbsp;
                        <span>{new Date(item.sysdate).toLocaleDateString()}</span>
                        &nbsp;
                        <button onClick={() => onEdit(item)}>수정</button>
                        <button onClick={() => onDel(item)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CityMyhome;