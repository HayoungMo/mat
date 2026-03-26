import React, { useState } from 'react';
import BoardService from './BoardService';

const BoardWrite = ({ onAdd, onCancel }) => {
    const [board, setBoard] = useState({
        userId: '',
        title: '',
        subject: '', // 텍스트/이미지일 때는 일반 내용, 설문일 때는 옵션 문자열이 담김
        type: 'text',
    });
    
    // 설문 옵션들을 관리하는 배열 상태 (초기값 빈 문자열 2개)
    const [options, setOptions] = useState(['', '']);
    const [image, setImage] = useState(null);

    const changeInput = (e) => {
        const { name, value } = e.target;
        setBoard({ ...board, [name]: value });
    };

    // 옵션 입력값 변경 함수 (반복문 내 input 업데이트)
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // 옵션 추가 함수
    const addOption = () => setOptions([...options, '']);

    // 옵션 삭제 함수 (최소 2개 유지)
    const removeOption = (index) => {
        if (options.length <= 2) return alert("최소 2개의 옵션이 필요합니다.");
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!board.userId || !board.title) return alert("작성자와 제목은 필수입니다.");

        const formData = new FormData();
        formData.append('userId', board.userId);
        formData.append('title', board.title);
        formData.append('type', board.type);
        
        // [핵심 로직] 설문 타입일 때 옵션 배열을 문자열로 변환하여 subject에 저장
        if (board.type === 'survey') {
            // 비어있는 옵션은 제외하고 저장
            const filteredOptions = options.filter(opt => opt.trim() !== '');
            if (filteredOptions.length < 2) return alert("최소 2개 이상의 내용을 입력해주세요.");
            formData.append('subject', JSON.stringify(filteredOptions)); 
        } else {
            formData.append('subject', board.subject);
        }

        if (image && board.type === 'image') {
            formData.append('images', image);
        }

        try {
            await BoardService.addMat(formData);
            alert("게시글이 성공적으로 등록되었습니다!");
            onAdd();
        } catch (err) {
            alert("서버 오류 발생: 등록에 실패했습니다.");
        }
    };

    return (
        <form onSubmit={onSubmit} className="write-form">
            <table className="write-table" style={{ width: '100%', border: '1px solid #ddd', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <td style={{ padding: '15px' }}><strong>Logo</strong> 맛집 게시글 작성</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            글쓴이: <input name="userId" onChange={changeInput} placeholder="ID 입력" style={{ padding: '5px' }} />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            제목: <input name="title" onChange={changeInput} style={{ width: '80%', padding: '5px' }} placeholder="제목 입력" />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px' }}>
                            <label><input type="radio" name="type" checked={board.type === 'text'} onChange={() => setBoard({...board, type:'text'})} /> 텍스트</label>
                            <label style={{ marginLeft: '10px' }}><input type="radio" name="type" checked={board.type === 'image'} onChange={() => setBoard({...board, type:'image'})} /> 이미지포함 </label>
                            <label style={{ marginLeft: '10px' }}><input type="radio" name="type" checked={board.type === 'survey'} onChange={() => setBoard({...board, type:'survey'})} /> 설문</label>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style={{ padding: '10px' }}>
                       

                            {board.type !== 'survey' ? (
                                <div>
                                    <textarea 
                                        name="subject" 
                                        onChange={changeInput} 
                                        placeholder="내용을 입력하세요" 
                                        style={{ width: '100%', height: '150px', padding: '10px', boxSizing: 'border-box' }} 
                                    />
                                    {board.type === 'image' && (
                                        <div style={{marginTop: '10px'}}>
                                            파일첨부: <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', border: '1px solid #eee' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>📊 설문 항목 (필요한 만큼 추가하세요)</p>
                                    
                                    {/* [반복문] options 배열을 돌려서 input들 생성 */}
                                    {options.map((opt, index) => (
                                        <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '10px' }}>{index + 1}.</span>
                                            <input 
                                                value={opt} 
                                                onChange={(e) => handleOptionChange(index, e.target.value)} 
                                                placeholder={`옵션 ${index + 1} 내용을 입력`} 
                                                style={{ width: '70%', padding: '5px' }}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => removeOption(index)} 
                                                style={{ marginLeft: '10px', color: 'red', border: '1px solid red', background: 'none', cursor: 'pointer', borderRadius: '3px' }}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <button 
                                        type="button" 
                                        onClick={addOption} 
                                        style={{ marginTop: '5px', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '3px' }}
                                    >
                                        + 항목 추가
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td style={{ textAlign: 'center', padding: '20px' }}>
                            <button type="submit" className="btn-submit" style={{ padding: '10px 30px', backgroundColor: '#2d5a3d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>올리기</button>
                            <button type="button" onClick={onCancel} className="btn-cancel" style={{ marginLeft: '10px', padding: '10px 30px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}>취소</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
};

export default BoardWrite;