import React from 'react';
import {Link,Route,Routes} from 'react-router-dom';
import CityHome from './CityHome';
import CityArticle from './CityArticle';
import CityEdit from './CityEdit';
import articleServices from '../services/articleServices';

const CityAll = ({loginUser}) => {

        const onUpdate= async (id,formData)=>{
        await articleServices.updateArticle(id,formData)
    }

    return (
        <div>
            <h1>블로그 모음</h1>
            <Link to='/city/Gangnam'><button>강남구</button></Link>
            <Link to='/city/Yongsan'><button>용산구</button></Link>
            <Link to='/city/Dongjak'><button>동작구</button></Link>
            <Link to='/city/Mapo'><button>마포구</button></Link>
            <Link to='/city/Jung'><button>중구</button></Link>


            <Routes>
                <Route path=':cityName' element={<CityHome loginUser={loginUser}/>} />
                <Route path=':cityName/article/:id' element={<CityArticle loginUser={loginUser}/>}/>
                <Route path=':cityName/article/edit/:id' element={<CityEdit onUpdate={onUpdate} loginUser={loginUser}/>}/>
            </Routes>
        </div>
    );
};

export default CityAll;