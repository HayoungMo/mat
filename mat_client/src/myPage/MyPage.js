import React from 'react';
import AdminPage from './admin/AdminPage';
import CityPage from './cityUser/CityPage';
import UserPage from './user/UserPage';


const MyPage = ({loginUser,loginInfo}) => {
    
   const role = loginInfo?.role;

   const renderPage = ()=>{
        switch (role) {
            case 'admin':
                return <AdminPage/>
            case 'city':
                return <CityPage loginInfo={loginInfo} loginUser={loginUser}/>
            default:
                return <UserPage loginInfo={loginInfo} loginUser={loginUser}/>
        }
   }

   return(
        <div>
            {renderPage()}
        </div>
   );

};

export default MyPage;