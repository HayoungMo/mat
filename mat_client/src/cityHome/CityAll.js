import React from 'react';
import {Link,Route,Routes} from 'react-router-dom';
import CityHome from './CityHome';

const CityAll = () => {
    return (
        <div>
            <h1>블로그 모음</h1>
            <Link to='/city/seoul1'><button>블로그 1</button></Link>
            <Link to='/city/seoul2'><button>블로그 2</button></Link>
            <Link to='/city/seoul3'><button>블로그 3</button></Link>
            <Link to='/city/seoul4'><button>블로그 4</button></Link>
            <Link to='/city/seoul5'><button>블로그 5</button></Link>


            <Routes>
                <Route path='seoul1' element={<CityHome/>}></Route>
                <Route path='seoul2' element={<CityHome/>}></Route>
                <Route path='seoul3' element={<CityHome/>}></Route>
                <Route path='seoul4' element={<CityHome/>}></Route>
                <Route path='seoul5' element={<CityHome/>}></Route>
            </Routes>
        </div>
    );
};

export default CityAll;