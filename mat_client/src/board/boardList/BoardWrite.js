import React, { useState, useEffect } from 'react';
import BoardService from './BoardService';
import { 
    MdEditNote, MdPerson, MdTitle, MdOutlineCategory, 
    MdDescription, MdCloudUpload, MdAddCircleOutline, 
    MdClose, MdHowToVote, MdHistoryEdu, MdImage, MdCheckCircle,
    MdFormatBold, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight
} from "react-icons/md";

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

    // ✅ 서식 상태값
    const [font, setFont] = useState('Pretendard');
    const [align, setAlign] = useState('left');
    const [weight, setWeight] = useState('400');

    const fontOptions = [
        { label: '기본설정', value: 'Pretendard' },
        { label: '나눔고딕체', value: 'Nanum Gothic' },
        { label: '본고딕체', value: 'Noto Sans KR' },
        { label: '궁서체', value: 'Gungsuh' },
        { label: '함초롬바탕체', value: 'Batang' }
    ];

    // ✅ 로그인 유저 자동 세팅
    useEffect(() => {
        if (loginUser) {
            setBoard(prev => ({ ...prev, userId: loginUser }));
        }
    }, [loginUser]);

    // ✅ 다음 번호 조회
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

        let subjectValue = "";
        if (board.type === 'survey') {
            const filtered = options.filter(o => o.trim() !== '');
            if (filtered.length < 2) return alert("설문 옵션을 최소 2개 입력해주세요.");
            subjectValue = JSON.stringify(filtered);
        } else {
            if (!board.subject.trim()) return alert("내용을 입력해주세요.");
            subjectValue = JSON.stringify({
                content: board.subject,
                font: font,
                align: align,
                weight: weight
            });
        }
        formData.append('subject', subjectValue);

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
            alert("서버 오류: 등록에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="write-form">
            <h3 className="form-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MdEditNote size={28} style={{ color: '#8a2130' }} /> 맛집 게시글 작성
            </h3>

            <table className="write-table">
                <tbody>
                    <tr>
                        <th>NO</th>
                        <td>
                            <span style={{ color: '#888', fontSize: '14px' }}>#{nextNo}</span>
                        </td>
                    </tr>

                    <tr>
                        <th><MdPerson /> 작성자</th>
                        <td>
                            {loginUser ? (
                                <span style={{ fontWeight: 'bold', color: '#2d5a3d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {loginUser}
                                    <span style={{ fontSize: '11px', color: '#888' }}>(로그인됨)</span>
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
                        <th><MdTitle /> 제목</th>
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
                        <th><MdOutlineCategory /> 유형</th>
                        <td>
                            <div className="type-select">
                                {['text', 'image', 'survey'].map(t => (
                                    <label
                                        key={t}
                                        className={`type-label ${board.type === t ? 'active' : ''}`}
                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                                    >
                                        <input
                                            type="radio"
                                            name="type"
                                            value={t}
                                            checked={board.type === t}
                                            onChange={() => setBoard(prev => ({ ...prev, type: t }))}
                                            style={{ display: 'none' }}
                                        />
                                        {t === 'text' && <><MdHistoryEdu /> 텍스트</>}
                                        {t === 'image' && <><MdImage /> 이미지</>}
                                        {t === 'survey' && <><MdHowToVote /> 설문</>}
                                    </label>
                                ))}
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <th><MdDescription /> 내용</th>
                        <td>
                            {board.type === 'survey' ? (
                                <div className="survey-box">
                                    <p className="survey-hint" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <MdHowToVote /> 설문 항목을 입력하세요 (최소 2개)
                                    </p>
                                    {options.map((opt, i) => (
                                        <div key={i} className="survey-option-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                                            <span className="option-num">{i + 1}.</span>
                                            <input
                                                style={{ flex: 1 }}
                                                value={opt}
                                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                                placeholder={`옵션 ${i + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeOption(i)}
                                                style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}
                                            >
                                                <MdClose size={20} />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn-add-opt" onClick={addOption}>
                                        <MdAddCircleOutline /> 항목 추가
                                    </button>
                                </div>
                            ) : (
                                <div className="editor-container">
                                    {/* ✅ 툴바를 textarea 바로 위에 배치 */}
                                    <div className="editor-toolbar" style={{ 
                                        display: 'flex', gap: '8px', padding: '8px', background: '#f1f3f5', 
                                        border: '1px solid #ccc', borderBottom: 'none', borderRadius: '4px 4px 0 0' 
                                    }}>
                                        <select value={font} onChange={(e) => setFont(e.target.value)} style={{ padding: '3px', fontSize: '13px' }}>
                                            {fontOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                        
                                        <button 
                                            type="button" 
                                            onClick={() => setWeight(weight === '700' ? '400' : '700')}
                                            style={{ 
                                                padding: '4px 8px', background: weight === '700' ? '#8a2130' : '#fff', 
                                                color: weight === '700' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '3px'
                                            }}
                                        >
                                            <MdFormatBold size={16} />
                                        </button>

                                        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '3px', overflow: 'hidden' }}>
                                            {[
                                                { val: 'left', icon: <MdFormatAlignLeft /> },
                                                { val: 'center', icon: <MdFormatAlignCenter /> },
                                                { val: 'right', icon: <MdFormatAlignRight /> }
                                            ].map(item => (
                                                <button
                                                    key={item.val}
                                                    type="button"
                                                    onClick={() => setAlign(item.val)}
                                                    style={{
                                                        padding: '4px 8px', background: align === item.val ? '#093c71' : '#fff',
                                                        color: align === item.val ? '#fff' : '#333', border: 'none', cursor: 'pointer'
                                                    }}
                                                >
                                                    {item.icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <textarea
                                        name="subject"
                                        value={board.subject}
                                        onChange={changeInput}
                                        placeholder="내용을 입력하세요"
                                        style={{ 
                                            width: '100%', 
                                            minHeight: '200px',
                                            padding: '15px',
                                            fontFamily: font,
                                            textAlign: align,
                                            fontWeight: weight,
                                            border: '1px solid #ccc',
                                            borderRadius: '0 0 4px 4px',
                                            outline: 'none',
                                            resize: 'vertical'
                                        }}
                                    />

                                    {board.type === 'image' && (
                                        <div className="file-row" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: '#eee', padding: '5px 10px', borderRadius: '4px' }}>
                                                <MdCloudUpload /> 파일 첨부
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setImage(e.target.files[0])}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            {image && (
                                                <span style={{ fontSize: '12px', color: '#2d5a3d', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <MdCheckCircle /> {image.name}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button type="submit" className="btn-submit" disabled={submitting} style={{ padding: '10px 25px', background: '#8a2130', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {submitting ? '등록 중...' : '올리기'}
                </button>
                <button type="button" className="btn-cancel" onClick={onCancel} disabled={submitting} style={{ padding: '10px 25px', background: '#093c71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    취소
                </button>
            </div>
        </form>
    );
};

export default BoardWrite;