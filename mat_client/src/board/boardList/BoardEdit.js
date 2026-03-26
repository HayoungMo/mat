import React, { useState, useEffect } from 'react';
import BoardService from './BoardService';

const BoardEdit = ({ item, onUpdate, onCancel }) => {
    // 1. 기존 데이터로 초기 상태 설정
    const [board, setBoard] = useState({
        userId: '',
        title: '',
        subject: '',
        type: 'text',
        opt1: '',
        opt2: ''
    });
    const [image, setImage] = useState(null);

    // 컴포넌트 마운트 시 데이터 세팅
    useEffect(() => {
        if (item) {
            setBoard({
                userId: item.userId || '',
                title: item.title || '',
                subject: item.subject || '',
                type: item.type || 'text',
                opt1: item.opt1 || '',
                opt2: item.opt2 || ''
            });
        }
    }, [item]);

    const changeInput = (e) => {
        const { name, value } = e.target;
        setBoard({ ...board, [name]: value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // 2. 수정 시 타입 자동 재판별 (로직 강화)
        let finalType = board.type;
        if (image) finalType = 'image'; // 새 이미지를 올리면 무조건 image 타입
        if (board.opt1 || board.opt2) finalType = 'survey'; // 설문 옵션이 있으면 survey

        const formData = new FormData();
        formData.append('userId', board.userId);
        formData.append('title', board.title);
        formData.append('subject', board.subject);
        formData.append('type', finalType);
        
        if (finalType === 'survey') {
            formData.append('opt1', board.opt1);
            formData.append('opt2', board.opt2);
        }
        if (image) formData.append('images', image);

        try {
            await BoardService.updateMat(item._id, formData);
            alert("수정이 완료되었습니다!");
            onUpdate(); // 목록 새로고침 및 이동
        } catch (e) {
            alert("수정 실패: 서버 상태를 확인하세요.");
        }
    };

    return (
        <form onSubmit={onSubmit} className="write-form">
            <h3 style={{color: '#2d5a3d'}}>게시글 수정</h3>
            <table className="write-table">
                <tbody>
                    <tr>
                        <td>작성자: <input name="userId" value={board.userId} readOnly style={{backgroundColor: '#f0f0f0'}} /></td>
                    </tr>
                    <tr>
                        <td>타입 변경: 
                            <select name="type" value={board.type} onChange={changeInput}>
                                <option value="text">일반 텍스트</option>
                                <option value="image">이미지 포스팅</option>
                                <option value="survey">설문조사</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>제목: <input name="title" value={board.title} onChange={changeInput} required /></td>
                    </tr>

                    {/* 타입이 survey일 때만 옵션창 노출 */}
                    {board.type === 'survey' && (
                        <tr>
                            <td className="survey-inputs">
                                <p>📊 설문 옵션 수정</p>
                                <input name="opt1" value={board.opt1} placeholder="옵션 1" onChange={changeInput} />
                                <input name="opt2" value={board.opt2} placeholder="옵션 2" onChange={changeInput} />
                            </td>
                        </tr>
                    )}

                    <tr>
                        <td>내용: <textarea name="subject" value={board.subject} onChange={changeInput} /></td>
                    </tr>
                    
                    <tr>
                        <td>
                            사진 변경: <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                            {item.saveFileName && <p style={{fontSize: '12px', color: '#666'}}>기존 파일: {item.originalFileName}</p>}
                        </td>
                    </tr>
                    
                    <tr className="btn-row">
                        <td>
                            <button type="submit" className="btn-primary">수정 완료</button>
                            <button type="button" onClick={onCancel} className="btn-cancel">취소</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
};

export default BoardEdit;