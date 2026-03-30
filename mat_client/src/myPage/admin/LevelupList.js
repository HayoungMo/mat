import React,{ useEffect, useState } from 'react';
import LevelupItem from './LevelupItem';
import upgradeServices from '../../services/upgradeServices';

const LevelupList = () => {

    const [list, setList] = useState([])

    useEffect(()=>{
        const fetchData = async() =>{
            const res = await upgradeServices.getUpgrade()
            const pending = res.filter(item=>item.status === 'pending')
            setList(pending)
        }
        fetchData()
    },[])

    return (
        <ul>
            {list.map((item,index)=>(
                <li key={index}>
                <LevelupItem item={item} setList={setList} list={list}/>
                </li>
            ))} 
        </ul>
    );
};

export default LevelupList;