import React, { useEffect, useState } from 'react';
import CityList from './CityList';
import articleService from '../services/articleServices'
import CityMessage from './CityMessage';
import CityAdd from './CityAdd';
import CityEdit from './CityEdit';
import { useParams,useNavigate } from 'react-router-dom';

const CityHome = () => {

    const {cityName} = useParams()
    const navigate = useNavigate()

    const [articles,setArticles] = useState([])
    const [isEdit,setIsEdit] = useState(false)
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
    const onUpdate= async (id,formData)=>{
        setIsEdit(false)
        console.log("id:",id)
        console.log("data:",formData)
        await articleService.updateArticle(id,formData)
        await onData()
        onShow('수정완료')
    }

    const onShow =(msg)=>{
        setMsg(msg)
        setIsShow(true)
    }
    return (
        <div>
            <h1>개인 블로그</h1>
            <CityAdd/>
            {
                isShow && <CityMessage msg={msg} isShow={isShow} setIsShow={setIsShow}/>
            }
            
            <CityList articles={articles} onEdit={onEdit} onDel={onDel}/>
            <hr/>
        </div>
    );
};

export default CityHome;