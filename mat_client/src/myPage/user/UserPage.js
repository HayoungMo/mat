import React, { useEffect, useState } from 'react';
import upgradeService from '../../services/upgradeServices';
import UserMyPage from './UserMyPage';
import { Route, Routes, useLocation } from 'react-router-dom';

const UserPage = ({loginUser}) => {
    const [ugUsers, setUgUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation()

    useEffect(()=>{
        const fetchData= async()=>{
            setLoading(true)
            const res = await upgradeService.getUpgrade()
            const myRequest = res.filter(item=>item.userId===loginUser)
            setUgUsers(myRequest)
            setLoading(false)
        }
        fetchData()
    },[loginUser,location.state])

    if (loading) return <div>로딩중... </div>
    
    return (
        <div>
            <Routes>
                {/* 🌟 핵심: 하위 라우팅은 UserMyPage 안에서 처리하도록 와일드카드(/*)를 씁니다 */}
                <Route path='/*' element ={<UserMyPage loginUser={loginUser} ugUsers={ugUsers}/>}/>
            </Routes>
        </div>
    );
};

export default UserPage;