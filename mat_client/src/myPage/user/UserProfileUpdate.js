import React, { useEffect, useState } from 'react';

const UserProfileUpdate = ({current,onUpdate,setIsEdit}) => {
    const [user,setUser] = useState(current)
    const {id,name,job} =user

    const changeInput =(evt)=>{
        const{value,name}=evt.target
        setUser({
            ...user,
            [name]:value
        })
    }

    const onSubmit=(evt)=>{
        evt.preventDefault()
        
        onUpdate(user)

        setUser({
            name:'',job:''
        })
    }

    useEffect(()=>{
        setUser(current)
    },[current])

    return (
        <form onSubmit={onSubmit}>
            <p>
                <label>이름</label>
                <input type='text' value={name} name='name' onChange={changeInput}/>
            </p> 
            <p>
                <label>직업</label>
                <input type='text' value={job} name='job' onChange={changeInput}/>
            </p>
            <p>
                <button>수정</button>
                <button onClick={()=>setIsEdit(false)}>취소</button>
            </p>
        </form>
    );
};

export default UserProfileUpdate;