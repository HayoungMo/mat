import React, { useEffect } from 'react';

const CityMessage = ({msg,isShow,setIsShow}) => {

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setIsShow(false)
        },4000)

        return()=>{
            clearTimeout(timer)
        }
    },[isShow])

    return (
        <div>
            {msg}
        </div>
    );
};

export default CityMessage;