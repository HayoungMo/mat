import React, { useState, useEffect } from 'react';
import BoardService from './BoardService';

const BoardWrite = ({ loginUser, onAdd, onCancel }) => {
    const [board, setBoard] = useState({
        userId: '',
        title: '',
        subject: '',
        type: 'text',
    });
    const [options, setOptions] = useState(['', '']);
    const [image, setImage] = useState(null);
    const [nextNo, setNextNo] = useState('...');

    // 로그인 유저면 자동입력
    useEffect(() => {
        if (loginUser) {
            setBoard(prev => ({ ...prev, userId: loginUser }));
        }
    }, [loginUser]);

    // 다음 글번호 가져오기 (현재 목록 수 + 1)
    useEffect(() => {
        BoardService.getMatList()
            .then(data => setNextNo(data.length + 1))
            .catch(() => setNextNo('-'));
    }, []);

    const changeInput = (e) => {
        const { name, value } = e.target;
        setBoard({ ...board, [name]: value });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);

    const removeOption = (index) => {
        if (options.length <= 2) return alert("최소 2개의 옵션이 필요합니다.");
        setOptions(options.filter((_, i) => i !== index));
    };

    const onSubmit = async (e) => {
    e.preventDefault();

        // 1. 작성자 결정: 
        const finalUserId = board.userId.trim() || `쓰니${nextNo}`;

        if (!board.title.trim()) return alert("제목을 입력해주세요.");

        const formData = new FormData();
        formData.append('userId', finalUserId);
        formData.append('title', board.title);
        formData.append('type', board.type);

        if (board.type === 'survey') {
            const filtered = options.filter(o => o.trim() !== '');
            if (filtered.length < 2) return alert("설문 옵션을 최소 2개 입력해주세요.");
            formData.append('subject', filtered.join('^')); // ^ 구분자로 저장
        } else {
            if (!board.subject.trim()) return alert("내용을 입력해주세요.");
            formData.append('subject', board.subject);
        }

        if (board.type === 'image' && image) {
            formData.append('images', image);
        }

        try {
                await BoardService.addMat(formData);
               
                alert(`게시글이 등록되었습니다! (작성자: ${finalUserId})`); 
                onAdd();
            } catch (err) {
                console.error(err); 
                alert("서버 오류: 등록에 실패했습니다.");
            }
    };

    return (
        <form onSubmit={onSubmit} className="write-form">
            <h3 className="form-title">✏️ 맛집 게시글 작성</h3>

            <table className="write-table">
                <tbody>
                   
                    <tr>
                        <th>NO</th>
                        <td>
                            <span className="no-text">#{nextNo}</span>
                        </td>
                    </tr>

                    {/* 작성자 - 로그인 유저면 고정, 아니면 입력 */}
                    <tr>
                        <th>작성자</th>
                        <td>
                            {loginUser ? (
                                <span className="userId-fixed">
                                    {loginUser}
                                    <span className="userId-badge"></span>
                                </span>
                            ) : (
                                <input
                                    name="userId"
                                    value={board.userId}
                                    onChange={changeInput}
                                    placeholder={!loginUser ? `미입력 시 '쓰니${nextNo}'` : ""}
                                    required={false}
                                />
                            )}
                        </td>
                    </tr>

                    <tr>
                        <th>제목</th>
                        <td>
                            <input
                                name="title"
                                value={board.title}
                                onChange={changeInput}
                                placeholder="제목 입력"
                                required
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>유형</th>
                        <td>
                            <div className="type-select">
                                {['text', 'image', 'survey'].map(t => (
                                    <label key={t} className={`type-label ${board.type === t ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value={t}
                                            checked={board.type === t}
                                            onChange={() => setBoard({ ...board, type: t })}
                                        />
                                        {t === 'text' ? '📝 텍스트' : t === 'image' ? '🖼 이미지' : '📊 설문'}
                                    </label>
                                ))}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>
                            {board.type === 'survey' ? (
                                <div className="survey-box">
                                    <p className="survey-hint">📊 설문 항목을 입력하세요 (최소 2개)</p>
                                    {options.map((opt, i) => (
                                        <div key={i} className="survey-option-row">
                                            <span className="option-num">{i + 1}.</span>
                                            <input
                                                value={opt}
                                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                                placeholder={`옵션 ${i + 1}`}
                                            />
                                            <button type="button" className="btn-remove-opt" onClick={() => removeOption(i)}>✕</button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn-add-opt" onClick={addOption}>+ 항목 추가</button>
                                </div>
                            ) : (
                                <>
                                    <textarea
                                        name="subject"
                                        value={board.subject}
                                        onChange={changeInput}
                                        placeholder="내용을 입력하세요"
                                    />
                                    {board.type === 'image' && (
                                        <div className="file-row">
                                            <label>📎 파일 첨부</label>
                                            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                                        </div>
                                    )}
                                </>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="form-footer">
                <button type="submit" className="btn-submit">올리기</button>
                <button type="button" className="btn-cancel" onClick={onCancel}>취소</button>
            </div>
        </form>
    );
};

export default BoardWrite;