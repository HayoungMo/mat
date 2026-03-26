import React, { useState, useEffect } from 'react';
import BoardService from './BoardService';

const BoardEdit = ({ item, onUpdate, onCancel }) => {
    const [board, setBoard] = useState({
        userId: '',
        title: '',
        subject: '',
        type: 'text',
    });
    const [options, setOptions] = useState(['', '']); // 설문 옵션 배열
    const [image, setImage] = useState(null);

    // subject 파싱 헬퍼 (JSON 배열 또는 '^' 구분자 모두 지원)
    const parseOptions = (subject) => {
        if (!subject) return ['', ''];
        try {
            const parsed = JSON.parse(subject);
            if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
        } catch {}
        const arr = subject.split('^').filter(Boolean);
        return arr.length >= 2 ? arr : ['', ''];
    };

    // 컴포넌트 마운트 시 기존 데이터 세팅
    useEffect(() => {
        if (!item) return;
        setBoard({
            userId: item.userId || '',
            title: item.title || '',
            subject: item.subject || '',
            type: item.type || 'text',
        });
        if (item.type === 'survey') {
            setOptions(parseOptions(item.subject));
        }
    }, [item]);

    const changeInput = (e) => {
        const { name, value } = e.target;
        setBoard({ ...board, [name]: value });
    };

    // 타입 변경 시 옵션 초기화
    const changeType = (newType) => {
        setBoard({ ...board, type: newType });
        if (newType === 'survey' && item?.type === 'survey') {
            setOptions(parseOptions(item.subject));
        }
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
        if (!board.title.trim()) return alert("제목을 입력해주세요.");

        const formData = new FormData();
        formData.append('userId', board.userId);
        formData.append('title', board.title);
        formData.append('type', board.type);

        if (board.type === 'survey') {
            const filtered = options.filter(o => o.trim() !== '');
            if (filtered.length < 2) return alert("설문 옵션을 최소 2개 입력해주세요.");
            formData.append('subject', JSON.stringify(filtered));
        } else {
            formData.append('subject', board.subject);
        }

        if (image) formData.append('images', image);

        try {
            await BoardService.updateMat(item._id, formData);
            alert("수정이 완료되었습니다!");
            onUpdate();
        } catch (e) {
            alert("수정 실패: 서버 상태를 확인해주세요.");
        }
    };

    return (
        <form onSubmit={onSubmit} className="write-form">
            <h3 className="form-title">✏️ 게시글 수정</h3>

            <table className="write-table">
                <tbody>
                    <tr>
                        <th>작성자</th>
                        <td>
                            <input
                                name="userId"
                                value={board.userId}
                                readOnly
                                className="input-readonly"
                            />
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
                        <th>유형 변경</th>
                        <td>
                            <div className="type-select">
                                {['text', 'image', 'survey'].map(t => (
                                    <label key={t} className={`type-label ${board.type === t ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value={t}
                                            checked={board.type === t}
                                            onChange={() => changeType(t)}
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
                                    <p className="survey-hint">📊 설문 항목 수정 (최소 2개)</p>
                                    {options.map((opt, i) => (
                                        <div key={i} className="survey-option-row">
                                            <span className="option-num">{i + 1}.</span>
                                            <input
                                                value={opt}
                                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                                placeholder={`옵션 ${i + 1}`}
                                            />
                                            <button
                                                type="button"
                                                className="btn-remove-opt"
                                                onClick={() => removeOption(i)}
                                            >✕</button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn-add-opt" onClick={addOption}>
                                        + 항목 추가
                                    </button>
                                </div>
                            ) : (
                                <textarea
                                    name="subject"
                                    value={board.subject}
                                    onChange={changeInput}
                                    placeholder="내용을 입력하세요"
                                />
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>사진 변경</th>
                        <td>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            {item?.originalFileName && (
                                <p className="current-file">📎 현재 파일: {item.originalFileName}</p>
                            )}
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
