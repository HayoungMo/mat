import {Link, Route, Routes} from "react-router-dom";
import LevelupAdd from "./LevelupAdd";
import React, { useEffect, useState } from 'react';
import upgradeService from '../../services/upgradeServices'
import LevelupPending from "./LevelupPending";
import LevelupRejected from "./LevelupRejected";
import CityMyhome from "./CityMyhome";

const LevelupStart = () => {

    
    const [ugUsers,setUgUsers] = useState([])
    const [isEdit,setIsEdit] =useState(false)
    const [current,setCurrent] = useState({})
    const [msg,setMsg] = useState('')

    useEffect(()=>{
        onData()
    },[])

    const onData = async()=>{
        const res = await upgradeService.getUpgrade()
        setUgUsers(res)
    }

    const onAdd=(upgradeuser)=>{

        upgradeService.addUpgrade(upgradeuser)
        onData()   

    }

    const onDel=(item)=>{
        upgradeService.deleteUpgrade(item._id)
        onData()

    }

    const onEdit =(updradeuser)=>{
        setCurrent(updradeuser)
        setIsEdit(true)

    }

    const onUpdate = (data) =>{
        setIsEdit(false)
        upgradeService.updateUpgrade(data)
        onData()
    }

    return (
        <>
        {
            ugUsers.state==='' ? 
            (
        
        <>
            
        <div>
            <h3>등업 정보 없음</h3>
            <h5>등업을 신청해주세요...</h5>
        </div>
        <div>
            
            <nav>
            <Link to='/mypage/gradeup'><button>등업 신청</button></Link>
            </nav>
        </div>

        <Routes>
            <Route path='/mypage/gradeup' element={<LevelupAdd/>} exact></Route>
        </Routes>
    
        </>
            )
        :

        ugUsers.state === 'approved' ? 
            (<CityMyhome/>)
            :
        ugUsers.state === 'pending' ?
            (<LevelupPending/>)
            :
            (<LevelupRejected/>)
           
        }
        </>
    );
};

export default LevelupStart;