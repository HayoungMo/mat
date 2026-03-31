import React, { useEffect, useState } from 'react';
import NoticeForm from './NoticeForm';
import NoticeList from './NoticeList';
import NoticeWrite from './NoticeWrite';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const boardStyle = `
  .Notice { padding: 20px; font-family: sans-serif; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { border-bottom: 1px solid #eee; padding: 12px; text-align: left; }
  tr:hover { background-color: #f9f9f9; }
  .img { cursor: pointer; color: #0066ff; }
  .detail-box { padding: 30px; border: 1px solid #ddd; border-radius: 8px; background: #fff; margin-top: 20px; }
  .btn-group { margin-top: 20px; display: flex; gap: 10px; }
  .btn-group button { padding: 8px 15px; cursor: pointer; }
  input, textarea { padding: 10px; width: 100%; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
`;

const Notice = ({ loginUser }) => {

    const navigete = useNavigate()

     const noticeData = [
        {_id: 1, rank: 1, title: '첫 번째 공지사항입니다', writer:'관리자', category:'공지', state:'유지', content: '공지사항 본문 내용입니다.'},
        {_id: 2, rank: 2, title: '공지 게시판 이용 안내', writer:'운영자', category:'공지', state:'신규', content: '게시판 수칙을 준수해 주세요.'}
    ]

    const [Notices, setNotice] = useState(noticeData)
    const [originData, setOriginData] = useState(noticeData)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isEdit, setIsEdit] = useState(false)
    const [editForm, setEditForm] = useState({title: '', content: ''})
    const [isWrite, setIsWrite] = useState(false)
    const [isDetail, setIsDetail] = useState(false)
    const [selectedNotice, setselectedNotice] = useState(null)

     const fetchNotices = async () => {
        try {
            const res = await axios.get('/api/notice')
            
            const combinedData = [
                ...res.data,
                ...noticeData
            ]
            
            setNotice(combinedData)
            setOriginData(combinedData)
        }catch (err) {
            console.error("데이터 로드 실패:",err)
        }
    }
  
    useEffect(() => {
        fetchNotices()

        const timer = setInterval(() => {
            setCurrentTime(new Date())
        },1000)
        return () => clearInterval(timer)
    },[])

    const getFullDateTime = () => {
        return currentTime.toLocaleString('ko-KR', {
            year:'numeric',
            month:'long',
            day:'numeric',
            weekday:'short',
            hour:'2-digit',
            minute:'2-digit',
            second:'2-digit',
            hour12:true
        })
    }


    const handleWriteBtn = () => {
        console.log("전달받은 setStep 타입:",typeof setStep)
        if(!loginUser) {
            alert("로그인 후 이용 가능합니다")
            navigete('/login') 
            return
        }
        setIsWrite(true)
    }

      const onEditStart = () => {
        if (selectedNotice.writer === '관리자' && loginUser !== 'admin') {
            alert("관리자 게시글은 수정 권한이 없습니다.");
            return; 
        }
        
        if (selectedNotice.writer !== loginUser && loginUser !== 'admin') {
            alert("작성자만 수정할 수 있습니다.");
            return;
        }

        setEditForm({ title: selectedNotice.title, content: selectedNotice.content });
        setIsEdit(true);
    }

    const onUpdate = async(_id) => {

        try {

            let success = true

            if(typeof _id === 'string' && _id.length > 10) {
            const res = await axios.put(`/api/notice/${_id}`, {
                title: editForm.title,
                content: editForm.content
            })
            success = res.data.success
        }
            if (success) {
                const updatedData = originData.map(item =>
                    item._id === _id ? {...item, title: editForm.title, content:editForm.content} : item
                )
            

            setOriginData(updatedData)
            setNotice(updatedData)
            setselectedNotice({...selectedNotice, title:editForm.title,content:editForm.content})

            setIsEdit(false)
            alert('게시글 수정이 완료되었습니다')
        }

        }catch (err) {
            console.error("수정 에러:",err)
            alert("수정에 실패했습니다")
        }
    }

    const onDel = async (_id) => {

        if(loginUser === 'admin') {

        }else {

        if(selectedNotice.writer === '관리자' && loginUser !== 'admin'){
            alert("권한이 없습니다")
            return
        }

        if(selectedNotice.writer !== loginUser && loginUser !== 'admin'){
            alert("작성자만 삭제할 수 있습니다")
            return
        }
    }

        if(!window.confirm('정말 삭제하시겠습니까?')) return
            
        try {
            const res = await axios.delete(`/api/notice/${_id}`)

            if(res.data.success) {
                alert('게시글이 삭제되었습니다')

                const updatedData = originData.filter(item => item._id !==_id)

                setOriginData(updatedData)
                setNotice(updatedData)
                setIsDetail(false)
            }
        }catch (err) {
            console.error("삭제 에러:",err)
            alert("삭제에 실패했습니다")
        }
    }
    


    const onAdd = async (title, writer, content) => {
        const now = new Date()
        const dateString = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`
        
        try {
            const res = await axios.post('/api/notice',{
                title,
                writer: loginUser || writer || '관리자',
                content,
                date: dateString,
                category:'일반',
                state:'신규'
            })

            if(res.data.success) {
                alert("게시글이 등록되었습니다")
                fetchNotices()
                setIsWrite(false)
            }
        }catch (err) {
            console.error("DB 저장 실패:",err)
            alert("서버 저장에 실패했습니다. 서버가 켜져 있는지 확인하세요")
        }
    }

    const onOpen = (_id) => {
        setselectedNotice(Notices.find(item => item._id === _id)) 
        setIsDetail(true)
        setIsEdit(false) 
    }

    const onSearch = (text) => {
        setNotice(originData.filter(item =>
            item.title.toLowerCase().includes(text.toLowerCase())
        ))
    }

    const getDate = () => {
        const now = new Date()
        return `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}`
    }

   

    return (
        <div className='Notice'>
            <style>{boardStyle}</style>
            <div style={{display:'flex',justifyContent:'space-between',
                alignItems:'center'}}>
            <h2>공지게시판 {getDate()}</h2>
            <span style={{color:'#666',fontSize:'0.9em'}}>{getFullDateTime()}</span>
            </div>

            {isWrite ? (
                <NoticeWrite onAdd={onAdd} setIsWrite={setIsWrite}/>
            ) : (
                <>
                    {isDetail && selectedNotice ? (
                        <div className='detail-box'>
                            {!isEdit ? (
                                <>
                                    <h3>{selectedNotice.title}</h3>
                                    <p><strong>작성자:</strong> {selectedNotice.writer}</p>
                                    <hr/>
                                    <div style={{minHeight:'150px', padding:'20px 0'}}>{selectedNotice.content}</div>
                                    <div className='btn-group'>
                                        <button onClick={onEditStart}>수정</button>
                                        <button onClick={() => onDel(selectedNotice._id)} style={{color:'red'}}>삭제</button>
                                        <button onClick={() => setIsDetail(false)}>목록으로</button>
                                    </div>
                                </>
                            ) : (
                                <div className='edit-mode'>
                                    <h3>공지사항 수정</h3>
                                    <p><input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} /></p>
                                    <p><textarea value={editForm.content} onChange={(e) => setEditForm({...editForm, content: e.target.value})} style={{height: '150px'}} /></p>
                                    <div className='btn-group'>
                                        <button onClick={() => onUpdate(selectedNotice._id)} style={{background: '#0066ff', color: '#fff'}}>저장</button>
                                        <button onClick={() => setIsEdit(false)}>취소</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                                <button onClick={handleWriteBtn}>글쓰기</button>
                            </div>
                            <NoticeForm onSearch={onSearch} />
                            <NoticeList Notices={Notices} onOpen={onOpen} onDel={onDel} />
                        </>
                    )}
                </>
            )} 
        </div>
    );
};

export default Notice;
