import React, { useEffect, useState } from 'react';

const NoticeForm = ({onSearch}) => {

    const [search,setSearch] = useState('')

    const changeInput = (evt) => {
        const {value} = evt.target
        setSearch(value)
    }

    useEffect(()=>{
        onSearch(search)
    },[search])

    const onSubmit = (evt) => {
        evt.preventDefault()

        if(!search) return

        onSearch(search)

        setSearch('')
    }

    return (
        <form className='NoticeForm' onSubmit={onSubmit}>
            <input type='text' placeholder='제목 및 내용 검색'
            value={search} onChange={changeInput}/>
        </form>
    );
};

export default NoticeForm;