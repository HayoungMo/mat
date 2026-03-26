import React from 'react';
import AdminPage from './admin/AdminPage';
import CityPage from './cityUser/CityPage';


const MyPage = () => {
    return (
        <div>
            
            <CityPage/>
            <hr/>
            <AdminPage/>
        </div> 
    );
};

export default MyPage;