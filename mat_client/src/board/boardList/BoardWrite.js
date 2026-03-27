


import React, { useRef, useState } from 'react';
import BoardService from './BoardService';

const BoardWrite = ({ onAdd, onCancel }) => {
    const titleRef = useRef();
    
    // 초기 상태에 모든 필수 필드 포함
    const boardForm = {
        userId: '',
        title: '',
        subject: '',
        region: '',   
        cityName: '', 
        matName: '',  
        opt1: '', opt2: '', opt3: '', opt4: '', opt5: '',
    };

    const [board, setBoard] = useState(boardForm);
    const { userId, title, subject, region, cityName, matName, isShowType } = board;
    const [isShow, setIsShow] = useState('text');
    const [image, setImage] = useState(null);

    const changeInput = (evt) => {
        const { value, name } = evt.target;
        setBoard({ ...board, [name]: value });
    };

    const changeFile = (evt) => {
        setImage(evt.target.files[0]);
    };

    const onSubmit = async (evt) => {
        evt.preventDefault();

        // 유효성 검사 (필수 필드가 비어있는지 확인)
        if (!title || !userId || !region || !cityName) {
            alert("글쓴이, 제목, 지역, 시/구는 필수 입력 사항입니다.");
            return;
        }

        const formData = new FormData();
        // 1. 모든 텍스트 데이터 추가
        Object.keys(board).forEach(key => {
            formData.append(key, board[key]);
        });

        // 2. 파일 추가 (백엔드 설정에 따라 'images' 또는 'image' 확인 필요)
        if (image) {
            formData.append('images', image);
        }

        try {
            await BoardService.addMat(formData);
            alert("게시글이 성공적으로 등록되었습니다.");
            onAdd(); 
        } catch (err) {
            console.error("서버 에러 상세:", err.response?.data || err.message);
            alert("등록 중 오류가 발생했습니다. 서버 터미널의 에러 로그를 확인해주세요.");
        }
    };

    return (
        <form onSubmit={onSubmit} encType="multipart/form-data">
            <table className="write-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '10px', backgroundColor: '#f4f4f4' }}>
                            <strong>Logo</strong> 맛집 게시글 작성
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            글쓴이: <input type='text' name='userId' value={userId} onChange={changeInput} placeholder="ID 입력" />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            지역: <input type='text' name='region' value={region} onChange={changeInput} placeholder="예: 서울" />
                            시/구: <input type='text' name='cityName' value={cityName} onChange={changeInput} placeholder="예: 강남구" />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            맛집이름: <input type='text' name='matName' value={matName} onChange={changeInput} style={{ width: '50%' }} />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            제목: <input type='text' name='title' value={title} onChange={changeInput} ref={titleRef} style={{ width: '80%' }} />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            <label><input type="radio" checked={isShow === 'text'} onChange={() => setIsShow('text')} /> 텍스트작성</label>
                            <label style={{ marginLeft: '10px' }}><input type="radio" checked={isShow === 'survey'} onChange={() => setIsShow('survey')} /> 설문조사</label>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            {isShow === 'text' ? (
                                <textarea name='subject' value={subject} onChange={changeInput} placeholder="내용을 입력하세요" style={{ width: '100%', height: '150px' }} />
                            ) : (
                                <div>
                                    <p>설문 옵션을 입력하세요</p>
                                    <input type='text' name='opt1' onChange={changeInput} placeholder="옵션 1" /><br/>
                                    <input type='text' name='opt2' onChange={changeInput} placeholder="옵션 2" />
                                </div>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            파일첨부: <input type='file' name="images" onChange={changeFile} />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '20px', textAlign: 'center' }}>
                            <button type='submit' style={{ backgroundColor: '#2d5a3d', color: '#fff', padding: '10px 30px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>올리기</button>
                            <button type="button" onClick={onCancel} style={{ marginLeft: '10px', padding: '10px 30px' }}>취소</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
};

export default BoardWrite;