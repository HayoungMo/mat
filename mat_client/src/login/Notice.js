import React, { useState } from 'react';
import NoticeForm from './NoticeForm';
import NoticeList from './NoticeList';
import NoticeWrite from './NoticeWrite';

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

const Notice = () => {
    const noticeData = [
        {id: 1, rank: 1, title: '첫 번째 공지사항입니다', writer:'관리자', category:'공지', state:'유지', content: '공지사항 본문 내용입니다.'},
        {id: 2, rank: 2, title: '공지 게시판 이용 안내', writer:'운영자', category:'공지', state:'신규', content: '게시판 수칙을 준수해 주세요.'}
    ]

    const [Notices, setNotice] = useState(noticeData)
    const [originData, setOriginData] = useState(noticeData)

    const [isEdit, setIsEdit] = useState(false)
    const [editForm, setEditForm] = useState({title: '', content: ''})
    const [isWrite, setIsWrite] = useState(false)
    const [isDetail, setIsDetail] = useState(false)
    const [selectedNotice, setselectedNotice] = useState(null)

    const onEditStart = () => {
        setEditForm({ title: selectedNotice.title, content: selectedNotice.content })
        setIsEdit(true)
    }

    const onUpdate = (id) => {
        const updatedData = originData.map(item =>
            item.id === id ? { ...item, title: editForm.title, content: editForm.content } : item
        )
        setOriginData(updatedData)
        setNotice(updatedData)
        setselectedNotice({ ...selectedNotice, title: editForm.title, content: editForm.content })
        setIsEdit(false)
        alert('수정이 완료되었습니다')
    }

    const onDel = (id) => {
        if(window.confirm('정말 삭제하시겠습니까?')){
            const updatedData = originData.filter(item => item.id !== id)
            setOriginData(updatedData)
            setNotice(updatedData)
            setIsDetail(false)
        }
    }

    const onAdd = (title, writer, content) => {
        const now = new Date()
        const dateString = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`
        const newItem = { id: Date.now(), rank: originData.length + 1, title, writer, category: '일반', state: '신규', content, date:dateString }
        const newData = [newItem, ...originData]
        setOriginData([...originData,newItem])
        setNotice([...originData,newItem])
        setIsWrite(false) 
    }

    const onOpen = (id) => {
        setselectedNotice(Notices.find(item => item.id === id)) 
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
            <h2>공지게시판 {getDate()}</h2>

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
                                        <button onClick={() => onDel(selectedNotice.id)} style={{color:'red'}}>삭제</button>
                                        <button onClick={() => setIsDetail(false)}>목록으로</button>
                                    </div>
                                </>
                            ) : (
                                <div className='edit-mode'>
                                    <h3>공지사항 수정</h3>
                                    <p><input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} /></p>
                                    <p><textarea value={editForm.content} onChange={(e) => setEditForm({...editForm, content: e.target.value})} style={{height: '150px'}} /></p>
                                    <div className='btn-group'>
                                        <button onClick={() => onUpdate(selectedNotice.id)} style={{background: '#0066ff', color: '#fff'}}>저장</button>
                                        <button onClick={() => setIsEdit(false)}>취소</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                                <button onClick={() => setIsWrite(true)}>글쓰기</button>
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
