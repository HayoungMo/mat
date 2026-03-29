import React, { useEffect, useState } from 'react';
import CityList from './CityList';
import articleService from '../services/articleServices'
import CityMessage from './CityMessage';
import CityAdd from './CityAdd';
import { useParams,useNavigate } from 'react-router-dom';

const CityHome = ({loginUser}) => {

    const {cityName} = useParams()

    console.log('param cityName',cityName)
    const navigate = useNavigate()

    const [articles,setArticles] = useState([])
    const [msg,setMsg] = useState('')
    const [isShow,setIsShow] = useState(false)

    useEffect(()=>{
        onData()
    },[cityName])

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
            <h1>개인 블로그</h1>
            <CityAdd onAdd={onAdd} loginUser={loginUser}/>
            {
                isShow && <CityMessage msg={msg} isShow={isShow} setIsShow={setIsShow}/>
            }
            
            <CityList articles={articles} onEdit={onEdit} onDel={onDel}/>
            <hr/>
        </div>
    );
};

export default CityHome;