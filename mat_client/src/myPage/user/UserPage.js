import React,{useEffect,useState} from 'react';
import LevelupStart from './levelup/LevelupStart';
import upgradeService from '../../services/upgradeServices';
import { Route, Routes, useLocation } from 'react-router-dom';
import LevelupAdd from './levelup/LevelupAdd';
import LevelupPending from './levelup/LevelupPending';
import LevelupRejected from './levelup/LevelupRejected';

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
            <h2>등업 페이지</h2>
            <Routes>
                <Route path='/' element={<LevelupStart loginUser={loginUser} ugUsers={ugUsers}/>}/>
                <Route path='/levelup' element={<LevelupAdd loginUser={loginUser}/>}/>
                <Route path='/pending' element={<LevelupPending/>}/>
                <Route path='/rejected' element={<LevelupRejected/>}/>
            </Routes>
        </div>
    );
};

export default UserPage;