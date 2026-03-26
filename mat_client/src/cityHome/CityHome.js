import React, { useEffect, useState } from 'react';
import CityList from './CityList';
import articleService from '../services/articleServices'
import CityMessage from './CityMessage';
import CityAdd from './CityAdd';

const CityHome = () => {

    const [articles,setArticles] = useState([])
    const [isEdit,setIsEdit] = useState(false)
    const [current,setCurrent] = useState({})
    const [msg,setMsg] = useState('')
    const [isShow,setIsShow] = useState(false)

    useEffect(()=>{
        onData()
    },[])

    const onData = async()=>{
        const res = await articleService.getArticle()
        setArticles(res)
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
    const onEdit=(user)=>{
        setCurrent(user)
        setIsEdit(true)
        onShow('수정')
    }
    const onUpdate= async (data)=>{
        setIsEdit(false)
        await articleService.updateArticle(data)
        await onData()
        onShow('수정완료')
    }

    const onShow =(msg)=>{
        setMsg(msg)
        setIsShow(true)
    }
    return (
        <div>
            <h1>여행사 홈</h1>
            <CityAdd onAdd={onAdd}/>
            {
                isShow && <CityMessage msg={msg} isShow={isShow} setIsShow={setIsShow}/>
            }
            
            <CityList articles={articles} onEdit={onEdit} onDel={onDel}/>
            <hr/>
        </div>
    );
};

export default CityHome;