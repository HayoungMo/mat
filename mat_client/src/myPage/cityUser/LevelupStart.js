import {Link, Route, Routes} from "react-router-dom";
import React from 'react';
import LevelupAdd from "./LevelupAdd";

const LevelupStart = () => {
    return (
        <>
        <div>
            <nav>
            <h3>등업 정보 없음</h3>
            <h5>등업을 신청해주세요...</h5>
            <Link to='/levelup/add'><button>등업 신청</button></Link>
            </nav>
        </div>

        <Routes>
            <Route element={<LevelupAdd/>} exact></Route>
        </Routes>

        </>
    );
};

export default LevelupStart;