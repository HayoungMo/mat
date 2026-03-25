import React, { useState } from 'react';

const NoticeWrite = ({ onAdd, setIsWrite }) => {
    
    const [user, setUser] = useState({ title: '', writer: '', content: '' });
    const { title, writer, content } = user;

    const onChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (!title || !writer || !content) {
            alert('모든 항목을 입력해주세요!');
            return;
        }
        
        onAdd(title, writer, content); 
        setIsWrite(false);    
    };

    return (
        <div className='NoticeWrite' style={{ padding: '20px', border: '1px solid #ddd', background: '#f9f9f9' }}>
            <h3>새 공지사항 작성</h3>
            <form onSubmit={onSubmit}>
                <p>
                    <label style={{display:'block', marginBottom:'5px'}}>제목</label>
                    <input type="text" name="title" placeholder="제목을 입력하세요" 
                           value={title} onChange={onChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                </p>
                <p>
                    <label style={{display:'block', marginBottom:'5px'}}>작성자</label>
                    <input type="text" name="writer" placeholder="작성자 성함" 
                           value={writer} onChange={onChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                </p>
                <p>
                    <label style={{display:'block', marginBottom:'5px'}}>내용</label>
                    <textarea name="content" placeholder="공지 내용을 입력하세요" 
                              value={content} onChange={onChange} 
                              style={{ width: '100%', height: '150px', marginBottom: '10px', padding: '8px' }} />
                </p>
                <div style={{textAlign: 'center'}}>
                    <button type="submit" style={{padding: '10px 20px', cursor: 'pointer'}}>등록</button>
                    <button type="button" onClick={() => setIsWrite(false)} style={{ marginLeft: '10px', padding: '10px 20px', cursor: 'pointer' }}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default NoticeWrite;
