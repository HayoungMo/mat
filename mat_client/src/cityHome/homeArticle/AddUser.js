import React, { useRef, useState } from 'react';
import ListUser from './ListUser';

const AddUser = ({onAdd}) => {

    const nameRef = useRef()

    const [user,setUser] = useState({
         title:'',writer:'',tag:'',content:'',matName:'',matTel:'',file:''
    })

    const {title,writer,tag,content,matName,matTel} =user

    const changeInput=(evt)=>{
        const {value,name} = evt.target
        setUser({
            ...user,
            [name]:value
        })

    }

    const onSubmit=(evt)=>{

        evt.preventDefault()

        if(!title||!writer) return

        onAdd(user)

        setUser({
            title:'',writer:'',tag:'',content:'',matName:'',file:''
        })

        nameRef.current.focus()

    }


    //이미지 업로드를 위한 코딩
    const [image,setImage] = useState()
    
        const changeImage = (evt) => {
            setImage(evt.target.files[0])            
        }

        //올리기 클릭 시 /list로 옮기기 위한 함수
        const submit=(evt) => {
            evt.preventDefault()
            if(!title||!writer) return
            onAdd(user)
            setUser({  title:'',writer:'',tag:'',content:'',matName:'',file:'' })

            window.location.href='/list'
        }

    return (
        <form onSubmit={onSubmit}>
            <h2>글쓰기</h2>
            <p>
                <label>제목</label>
                <input type='text' value={title} name='title' onChange={changeInput} ref={nameRef}/>
            </p>
            <p>
                <label>글쓴이</label>
                <input type='text' value={writer} name='writer' onChange={changeInput}/>
            </p>
            <p>
                <label>지역</label>
                <select name='tag' value={tag}onChange={changeInput}>
                <option value=''>선택</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='3'>5</option>
                </select>
            </p>
             <p>
                <label>맛집이름</label>
                <input type='text' value={matName} name='matName' onChange={changeInput}/>
            </p>
            <p>
                <label>맛집 전화번호</label>
                <input type='text' value={matTel} name='matTel' onChange={changeInput}/>
            </p>       


            <p>
                <label>내용</label>
                <textarea value={content} name='content' onChange={changeInput}/>
            </p>
            <p>
                <label>파일</label>
               <input type='file' onChange={changeImage}/>
            </p>
            
         
               <button type='submit'>올리기</button>
              
            
            <p>
              <button>취소</button>  
            </p>
            
        </form>

        
    );
};

export default AddUser;