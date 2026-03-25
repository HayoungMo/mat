import {Link, Route, Routes} from "react-router-dom";
import LevelupAdd from "./LevelupAdd";
import React from 'react';

const LevelupStart = () => {
    return (
        <>
        <div>
            <h3>등업 정보 없음</h3>
            <h5>등업을 신청해주세요...</h5>
        </div>
        <div>
            
            <nav>
            <Link to='/mypage/gradeup'><button>등업 신청</button></Link>
            </nav>
        </div>

        <Routes>
            <Route path='/mypage/gradeup' element={<LevelupAdd/>} exact></Route>
        </Routes>

        </>
    );
};

export default LevelupStart;