import React, { useEffect, useState } from 'react';
import upgradeService from '../../services/upgradeServices';
import UserMyPage from './UserMyPage';
import { Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';

const UserPage = ({loginUser,setLoginInfo}) => {
    const [ugUsers, setUgUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    //등업 상태 fetch 함수 (분리해서 재사용하게끔)
    const fetchData = async () => {
        try{
            const res = await upgradeService.getUpgrade();
            const myRequest = res.filter(item => item.userId === loginUser);
            setUgUsers(myRequest);

            //승인되면 유저 정보 서보에서 다시 가져와서 상태 갱신
            //재로그인 없이 role 변경
            if(myRequest[0]?.status === 'approved' && setLoginInfo) {
                const userRes = await axios.get(`/api/profile/${loginUser}`);
                setLoginInfo(userRes.data);
                localStorage.setItem('user',JSON.stringify(userRes.data));
            }
        } catch (err){
            console.error('등업상태 조회 실패',err);
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        //처음 한번 즉시 실행함
        fetchData(); 

        //10초마다 자동 갱신(재로그인 불필요)
        const interval = setInterval(()=>{
            fetchData();
        },10000);
        //페이지 벗어나게 되면 정리
        return () => clearInterval(interval); 
    },[loginUser, location.state]);

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