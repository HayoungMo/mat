import React, { useRef, useState } from 'react';
import BoardService from './BoardService';

const BoardEdit = ({ item, onUpdate, onCancel }) => {
    const titleRef = useRef();
    
    // 1. 기존 아이템 데이터를 초기값으로 설정
    const [board, setBoard] = useState({ ...item });
    const { userId, title, subject, opt1, opt2, opt3, opt4, opt5, region, cityName, matName } = board;
    
    // 2. 작성 모드 설정 (설문 데이터가 있으면 'survey', 없으면 'text')
    const [isShow, setIsShow] = useState(item.opt1 ? 'survey' : 'text');
    const [image, setImage] = useState(null); // 새로 수정할 이미지

    const changeInput = (evt) => {
        const { value, name } = evt.target;
        setBoard({ ...board, [name]: value });
    };

    const changeFile = (evt) => {
        setImage(evt.target.files[0]);
    };

    const onSubmit = async (evt) => {
        evt.preventDefault();
        if (!title) {
            alert("제목을 입력해주세요.");
            titleRef.current.focus();
            return;
        }

        const formData = new FormData();
        // 텍스트 필드 추가
        Object.keys(board).forEach(key => {
            formData.append(key, board[key]);
        });
        // 새로운 이미지가 선택되었다면 추가
        if (image) {
            formData.append('images', image);
        }

        try {
            // BoardService에 updateMat(또는 editMat) 함수가 있어야 함
            await BoardService.updateMat(item._id, formData); 
            alert("게시글이 수정되었습니다.");
            onUpdate(); // 수정 후 목록 새로고침
        } catch (err) {
            console.error(err);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <form onSubmit={onSubmit} encType="multipart/form-data">
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>📝 게시글 수정</h3>
            <table className="write-table" style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td>작성자: <strong>{userId}</strong></td>
                    </tr>
                    <tr>
                        <td>
                            <label>제목 </label>
                            <input type='text' name='title' value={title} onChange={changeInput} ref={titleRef} style={{ width: '80%' }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label><input type="checkbox" checked={isShow === 'text'} onChange={() => setIsShow('text')} /> 텍스트</label>
                            <label style={{ marginLeft: '10px' }}><input type="checkbox" checked={isShow === 'survey'} onChange={() => setIsShow('survey')} /> 설문</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {isShow === 'survey' ? (
                                <div>
                                    <input type='text' name='opt1' value={opt1} onChange={changeInput} placeholder="옵션 1" /><br/>
                                    <input type='text' name='opt2' value={opt2} onChange={changeInput} placeholder="옵션 2" /><br/>
                                    <input type='text' name='opt3' value={opt3} onChange={changeInput} placeholder="옵션 3" />
                                </div>
                            ) : (
                                <textarea name='subject' value={subject} onChange={changeInput} style={{ width: '100%', height: '150px' }}></textarea>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style={{ fontSize: '12px', color: '#666' }}>기존 이미지: {item.saveFileName || '없음'}</p>
                            <input type='file' name="images" onChange={changeFile} />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: 'right', paddingTop: '20px' }}>
                            <button type='submit' style={{ backgroundColor: '#2d5a3d', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer' }}>수정완료</button>
                            <button type="button" onClick={onCancel} style={{ marginLeft: '10px', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="form-footer">
                <button type="submit" className="btn-submit">수정 완료</button>
                <button type="button" className="btn-cancel" onClick={onCancel}>취소</button>
            </div>
        </form>
    );
};

export default BoardEdit;
