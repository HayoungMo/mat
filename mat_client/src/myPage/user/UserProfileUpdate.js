import React, { useEffect, useState } from 'react';

const UserProfileUpdate = ({users,current,onUpdate,setIsEdit,loginUser}) => {
    const [user,setUser] = useState(current)
    const {userId,tel,email} =user

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
            userId:'',tel:'',email:''
        })
    }

    useEffect(()=>{
        setUser(current)
    },[current])

    return (
        <form onSubmit={onSubmit}>
            <p>
                <label>전화번호</label>
                <input type='text' value={tel} name='tel' onChange={changeInput}/>
            </p>
            <p>
                <label>이메일</label>
                <input type='text' value={email} name='email' onChange={changeInput}/>
            </p>
            <p>
                <button type='submit'>수정</button>
                <button type='button' onClick={()=>setIsEdit(false)}>취소</button>
            </p>
        </form>
    );
};

export default UserProfileUpdate;