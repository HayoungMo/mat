import React, { useEffect, useState } from 'react';
import {Link,Route,Routes} from 'react-router-dom';
import CityHome from './CityHome';
import CityArticle from './CityArticle';
import CityEdit from './CityEdit';
import CityAdd from "./CityAdd";
import articleServices from '../services/articleServices';
import gangnamImg from './image/강남구.png'
import yongsanImg from './image/용산구.png'
import dongjakImg from './image/동작구.png'
import mapoImg from './image/마포구.png'
import jungImg from './image/중구.png'
import './CityAll.css'
import { useLocation } from 'react-router-dom';

const CityAll = ({loginUser,loginInfo}) => {

        const onUpdate= async (id,formData)=>{
        await articleServices.updateArticle(id,formData)
    }


    //이 코딩이 필요한 이유: 배너를 선택했을 때 어떤 구를 선택했는지 알기 위해
    const [selectedCity,setSelectedCity] = useState(null)

        
    const location  = useLocation();

    //이게 있어야 배너를 어느 페이지에서 숨길지 선택가능함
    const hideBanner = 
    location.pathname.includes('/article')||
    location.pathname.includes('/edit')||
    location.pathname.includes('/add')

    

    useEffect(() => {
  if (location.pathname === '/city') {
    setSelectedCity(null)
  }
}, [location.pathname])



    return (
       <div className={`city-container ${selectedCity ? 'city-selected' : ''}`}>

            {!hideBanner && (
                <>
            <Link to={'/city'}>
            
            </Link>

            {(!selectedCity || selectedCity==='Gangnam')&&(

            <Link to='/city/Gangnam' className="city-card"
             onClick={() => {
                setSelectedCity('Gangnam');
                
                }}>
            <img loading='lazy' src={gangnamImg} alt="강남구" />
            <div className='city-overlay'>강남구</div>            
       </Link>
       )}
            {(!selectedCity || selectedCity==='Yongsan')&&(
            <Link to='/city/Yongsan' className="city-card"
             onClick={() => {
                setSelectedCity('Yongsan');
               
                }}>
            <img loading='lazy' src={yongsanImg}  alt="용산구" />
            <div className="city-overlay">용산구</div>            
        </Link>
         )}
            
            {(!selectedCity || selectedCity==='Dongjak')&&(
            <Link to='/city/Dongjak' className="city-card"
             onClick={() => {
                setSelectedCity('Dongjak');
               
                }}>
            <img loading='lazy' src={dongjakImg} alt="동작구" />
            <div className='city-overlay'>동작구</div>            
        </Link>
         )}
            {(!selectedCity || selectedCity==='Mapo')&&(
            <Link to='/city/Mapo' className="city-card"
             onClick={() => {
                setSelectedCity('Mapo');
               
                }}>
            <img loading='lazy' src={mapoImg} alt="마포구" />
            <div className='city-overlay'>마포구</div>            
        </Link>
         )}

           {(!selectedCity || selectedCity==='Jung')&&(
            <Link to='/city/Jung' className="city-card"
             onClick={() => {
                setSelectedCity('Jung');
               
                }}>
            <img loading='lazy' src={jungImg} alt="중구" />
            <div className='city-overlay'>중구</div>            
        </Link>
        )}
        </>)}    

 


            <Routes>
                <Route path=':cityName' element={<CityHome loginUser={loginUser} loginInfo={loginInfo}/>} />
                <Route path=":cityName/add" element={<CityAdd loginUser={loginUser} loginInfo={loginInfo}/>
                } />
                <Route path=':cityName/article/:id' element={<CityArticle loginUser={loginUser} loginInfo={loginInfo}/>}/>
                <Route path=':cityName/article/edit/:id' element={<CityEdit onUpdate={onUpdate} loginUser={loginUser} loginInfo={loginInfo}/>}/>
            </Routes>
        </div>
    );
};

export default CityAll;