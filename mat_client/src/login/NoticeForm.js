import React, { useEffect, useState } from 'react';

const NoticeForm = ({onSearch}) => {

    const [search,setSearch] = useState('')

    const changeInput = (evt) => {
        setSearch(evt.target.value)
    }

    const onSubmit = (evt) => {
        evt.preventDefault()

       onSearch(search)
    }

    return (
        <form className='NoticeForm' onSubmit={onSubmit}>
            <input type='text' placeholder='제목 및 내용 검색'
            value={search} onChange={changeInput}  style={{flex:1,padding:'10px'}}/>
            <button type="submit"  style={{padding:'10px',cursor:'pointer'}}>
                검색
            </button>
        </form>
    );
};

export default NoticeForm;