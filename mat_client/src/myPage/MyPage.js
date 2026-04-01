import React from 'react';
import AdminPage from './admin/AdminPage';
import CityPage from './cityUser/CityPage';
import UserPage from './user/UserPage';


const MyPage = ({loginUser,loginInfo,setLoginInfo}) => {
    
   const role = loginInfo?.role;

   console.log('현재 로그인한 유저의 권한은:',role)

   const renderPage = ()=>{
        switch (role) {
            case 'admin':
                return <AdminPage loginInfo={loginInfo} loginUser={loginUser}/>
            case 'city':
                return <CityPage loginInfo={loginInfo} loginUser={loginUser}/>
            default:
                //setLoginInfo를 UserPage까지 전달
                return <UserPage loginInfo={loginInfo} loginUser={loginUser} setLoginInfo={setLoginInfo}/>
        }
   }

   return(
        <div>
            {renderPage()}
        </div>
   );

};

export default MyPage;