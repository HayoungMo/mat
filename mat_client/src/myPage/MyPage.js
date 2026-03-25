import React from 'react';
import AdminUser from './admin/AdminUser';
import CityUser from './cityuser/CityUser';


const MyPage = () => {
    return (
        <div>
            
            <CityUser/>
            <hr/>
            <AdminUser/>
        </div> 
    );
};

export default MyPage;