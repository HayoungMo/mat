import React from 'react';
import CityMyhome from './CityMyhome';

const CityPage = ({loginUser,loginInfo}) => {
    return (
        <div>
           <CityMyhome loginInfo={loginInfo} loginUser={loginUser}/> 
        </div>
    );
};

export default CityPage;