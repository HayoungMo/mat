import React, { useEffect, useState } from 'react';
import CityList from './CityList';
import articleService from '../services/articleServices'
import CityMessage from './CityMessage';
import CityAdd from './CityAdd';
import { useParams,useNavigate } from 'react-router-dom';

const cityNames = {
    Gangnam: '강남구',
    Yongsan: '용산구',
    Dongjak: '동작구',
    Mapo: '마포구',
    Jung: '중구'
};

const CityHome = ({loginUser,loginInfo}) => {

    
    const {cityName} = useParams()
    const [myCityName,setMyCityName] = useState('')
    const displayTitle = cityNames[cityName] || "우리 동네";

    console.log('param cityName',cityName)
    const navigate = useNavigate()

    const [articles,setArticles] = useState([])
    const [msg,setMsg] = useState('')
    const [isShow,setIsShow] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; //한페이지에 5개

    //cityName이 바뀌면 1페이지로 리셋하게 한다
    useEffect(() => {
        onData()
        setCurrentPage(1)
    },[cityName])

    //현재 페이지에 해당하는 그 구하는거... java에서 했던거
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const currentArticles = articles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(()=>{
        onData()
    },[cityName])

    useEffect(()=>{
        const fetchCity = async()=>{
            const res = await fetch('/api/upgrade')
            const data = await res.json()
            const approved = data.find(item=> item.userId === loginUser && item.status === 'approved')
            if(approved) setMyCityName(approved.cityName)
        }
    if(loginUser) fetchCity()
    },[loginUser])

    const onData = async()=>{
        const res = await articleService.getArticle()
        
        const filtered= res.filter(item=>item.cityName === cityName)
        
        setArticles(filtered)
    }

    const onAdd= async(user,image)=>{
        
        await articleService.addArticle(user,image)
        await onData()

        onShow('글 추가')
    }
    const onDel =async(item)=>{
        
        await articleService.deleteArticle(item._id)
        await onData()
        onShow('글 삭제')
    }
    const onEdit=(item)=>{
        navigate(`/city/${cityName}/article/edit/${item._id}`)
    }


    const onShow =(msg)=>{
        setMsg(msg)
        setIsShow(true)
    }
    return (
        <div>
            <h1>{displayTitle} 블로그</h1>
            {myCityName === cityName &&
                <CityAdd onAdd={onAdd} loginUser={loginUser}/>
            }
            {
                isShow && <CityMessage msg={msg} isShow={isShow} setIsShow={setIsShow}/>
            }
            
            <CityList articles={currentArticles} currentPage={currentPage} itemsPerPage={itemsPerPage} onEdit={onEdit} onDel={onDel} loginUser={loginUser} loginInfo={loginInfo}/>
            {totalPages > 1 && (
                <div style={{display:'flex',gap:'8px',justifyContent:'center',marginTop:'16px'}}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>이전</button>
                    {Array.from({length: totalPages}, (_,i) => (
                        <button key={i+1} onClick={() => setCurrentPage(i+1)}
                        style={{fontWeight: currentPage === i+1 ? 'bold' : 'normal'}}>
                            {i+1}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>다음</button>
                </div>
            )}
            <hr/>
        </div>
    );
};

export default CityHome;