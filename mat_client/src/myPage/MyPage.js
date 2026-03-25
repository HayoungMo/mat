import React from 'react';
import AdminPage from './admin/AdminPage';
import CityPage from './cityuser/CityPage';


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