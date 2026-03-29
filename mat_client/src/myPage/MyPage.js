import React from 'react';
import AdminPage from './admin/AdminPage';
import CityPage from './cityUser/CityPage';
import UserMyPage from './user/UserMyPage';


const MyPage = ({loginUser}) => {
    return (
        <div>
            
            <CityPage/>
            <hr/>
            <AdminPage/>
            <hr/>
            <UserMyPage loginUser={loginUser}/>
        </div> 
    );
};

export default MyPage;