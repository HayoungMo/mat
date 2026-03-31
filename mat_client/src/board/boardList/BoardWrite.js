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
    const [submitting, setSubmitting] = useState(false);

    // ✅ 로그인 유저 자동 세팅
    useEffect(() => {
        if (loginUser) {
            setBoard(prev => ({ ...prev, userId: loginUser }));
        }
    }, [loginUser]);

    // ✅ 다음 번호 조회 (1회만)
    useEffect(() => {
        BoardService.getMatList()
            .then(data => setNextNo(Array.isArray(data) ? data.length + 1 : '-'))
            .catch(() => setNextNo('-'));
    }, []);

    const changeInput = (e) => {
        const { name, value } = e.target;
        setBoard(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions(prev => [...prev, '']);

    const removeOption = (index) => {
        if (options.length <= 2) return alert("최소 2개의 옵션이 필요합니다.");
        setOptions(options.filter((_, i) => i !== index));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        const finalUserId = board.userId.trim() || `쓰니${nextNo}`;

        if (!board.title.trim()) return alert("제목을 입력해주세요.");

        const formData = new FormData();
        formData.append('userId', finalUserId);
        formData.append('title', board.title);
        formData.append('type', board.type);

        if (board.type === 'survey') {
            const filtered = options.filter(o => o.trim() !== '');
            if (filtered.length < 2) return alert("설문 옵션을 최소 2개 입력해주세요.");
           
            formData.append('subject', JSON.stringify(filtered));
        } else {
            if (!board.subject.trim()) return alert("내용을 입력해주세요.");
            formData.append('subject', board.subject);
        }

        if (board.type === 'image' && image) {
            formData.append('images', image);
        }

        setSubmitting(true);
        try {
            await BoardService.addMat(formData);
            alert(`게시글이 등록되었습니다! (작성자: ${finalUserId})`);
            onAdd();
        } catch (err) {
            console.error(err);
            alert("서버 오류: 등록에 실패했습니다. 서버 상태를 확인해주세요.");
        } finally {
            setSubmitting(false);
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
                            <span style={{ color: '#888', fontSize: '14px' }}>#{nextNo}</span>
                        </td>
                    </tr>

                    <tr>
                        <th>작성자</th>
                        <td>
                            {loginUser ? (
                                <span style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                    {loginUser}
                                    <span style={{ fontSize: '11px', color: '#888', marginLeft: '6px' }}>
                                        (로그인됨)
                                    </span>
                                </span>
                            ) : (
                                <input
                                    name="userId"
                                    value={board.userId}
                                    onChange={changeInput}
                                    placeholder={`미입력 시 '쓰니${nextNo}'로 등록`}
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
                                    <label
                                        key={t}
                                        className={`type-label ${board.type === t ? 'active' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="type"
                                            value={t}
                                            checked={board.type === t}
                                            onChange={() => setBoard(prev => ({ ...prev, type: t }))}
                                        />
                                        {t === 'text' ? '📝 텍스트' : t === 'image' ? '🖼✨ 이미지' : '📊 설문'}
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
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setImage(e.target.files[0])}
                                            />
                                            {image && (
                                                <span style={{ fontSize: '12px', color: '#2d5a3d' }}>
                                                    ✅ {image.name}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="form-footer">
                <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? '등록 중...' : '올리기'}
                </button>
                <button type="button" className="btn-cancel" onClick={onCancel} disabled={submitting}>
                    취소
                </button>
            </div>
        </form>
    );
};

export default BoardWrite;