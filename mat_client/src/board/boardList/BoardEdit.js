import React, { useState, useEffect } from 'react';
import BoardService from './BoardService';
import { 
    MdFormatBold, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight,
    MdCloudUpload, MdCheckCircle, MdClose, MdEdit, MdTitle, MdOutlineCategory,
    MdDescription, MdHowToVote, MdAddCircleOutline
} from "react-icons/md";

const BoardEdit = ({ item, onUpdate, onCancel }) => {
    const [board, setBoard] = useState({
        userId: '',
        title: '',
        subject: '',
        type: 'text',
    });
    const [options, setOptions] = useState(['', '']);
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // ✅ 서식 상태 (수정 시 기존 설정을 복원하기 위함)
    const [font, setFont] = useState('Pretendard');
    const [align, setAlign] = useState('left');
    const [weight, setWeight] = useState('400');

    const fontOptions = [
        { label: '기본(프리텐다드)', value: 'Pretendard' },
        { label: '몽글몽글(주아체)', value: 'Jua' },
        { label: '감성손글씨(나눔펜)', value: 'Nanum Pen Script' },
        { label: '레트로(도현체)', value: 'Do Hyeon' },
        { label: '클래식(궁서)', value: 'Gungsuh' }
    ];

    // ✅ [데이터 로드 로직] 기존 데이터를 불러와서 서식과 내용을 분리
    useEffect(() => {
        if (!item) return;

        let contentText = item.subject || '';
        
        // 1. 텍스트나 이미지 타입일 경우 JSON 파싱 시도
        if (item.type !== 'survey') {
            try {
                const parsedSubject = JSON.parse(item.subject);
                // 저장된 데이터가 객체 형태({content, font...})인지 확인
                if (parsedSubject && typeof parsedSubject === 'object' && parsedSubject.content !== undefined) {
                    contentText = parsedSubject.content;
                    setFont(parsedSubject.font || 'Pretendard');
                    setAlign(parsedSubject.align || 'left');
                    setWeight(parsedSubject.weight || '400');
                }
            } catch (e) {
                // 일반 문자열일 경우 그대로 사용
                contentText = item.subject;
            }
        }

        setBoard({
            userId: item.userId || '',
            title: item.title || '',
            subject: contentText,
            type: item.type || 'text',
        });

        // 2. 설문 타입일 경우 옵션 배열 추출
        if (item.type === 'survey') {
            try {
                const parsed = JSON.parse(item.subject);
                if (Array.isArray(parsed)) setOptions(parsed);
            } catch {
                const arr = item.subject.split('^').filter(Boolean);
                setOptions(arr.length >= 2 ? arr : ['', '']);
            }
        }
    }, [item]);

    const changeInput = (e) => {
        const { name, value } = e.target;
        setBoard(prev => ({ ...prev, [name]: value }));
    };

    const changeType = (newType) => {
        setBoard(prev => ({ ...prev, type: newType }));
        if (newType === 'survey' && options.every(opt => opt === '')) {
            setOptions(['', '']);
        }
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
        if (!board.title.trim()) return alert("제목을 입력해주세요.");

        const formData = new FormData();
        formData.append('userId', board.userId);
        formData.append('title', board.title);
        formData.append('type', board.type);

        // ✅ [데이터 저장 로직] 내용과 서식을 다시 JSON 문자열로 결합
        if (board.type === 'survey') {
            const filtered = options.filter(o => o.trim() !== '');
            if (filtered.length < 2) return alert("설문 옵션을 최소 2개 입력해주세요.");
            formData.append('subject', JSON.stringify(filtered));
        } else {
            const subjectData = {
                content: board.subject,
                font: font,
                align: align,
                weight: weight
            };
            formData.append('subject', JSON.stringify(subjectData));
        }

        if (image) formData.append('images', image);

        setSubmitting(true);
        try {
            const res = await BoardService.updateMat(item._id, formData);
            alert("수정이 완료되었습니다!");
            onUpdate(res.data); 
        } catch (e) {
            console.error(e);
            alert("수정 실패: 서버 상태를 확인해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!item) return <div className="loading">수정할 게시글 정보가 없습니다.</div>;

    return (
        <form onSubmit={onSubmit} className="write-form">
            <h3 className="form-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MdEdit size={24} style={{ color: '#8a2130' }} /> 게시글 수정
            </h3>

            <table className="write-table">
                <tbody>
                    <tr>
                        <th>작성자</th>
                        <td><input name="userId" value={board.userId} readOnly className="input-readonly" /></td>
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
                        <th><MdOutlineCategory /> 유형 변경</th>
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
                        <th><MdDescription /> 내용</th>
                        <td>
                            {board.type === 'survey' ? (
                                <div className="survey-box">
                                    <p className="survey-hint"><MdHowToVote /> 설문 항목 수정 (최소 2개)</p>
                                    {options.map((opt, i) => (
                                        <div key={i} className="survey-option-row">
                                            <span className="option-num">{i + 1}.</span>
                                            <input 
                                                value={opt} 
                                                onChange={(e) => handleOptionChange(i, e.target.value)} 
                                                placeholder={`옵션 ${i + 1}`} 
                                            />
                                            <button type="button" className="btn-remove-opt" onClick={() => removeOption(i)}>
                                                <MdClose />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn-add-opt" onClick={addOption}>
                                        <MdAddCircleOutline /> 항목 추가
                                    </button>
                                </div>
                            ) : (
                                <div className="editor-container">
                                    {/* ✅ 텍스트에어리어 바로 위에 위치한 툴바 */}
                                    <div className="editor-toolbar" style={{ 
                                        display: 'flex', gap: '8px', padding: '8px', background: '#f1f3f5', 
                                        border: '1px solid #ccc', borderBottom: 'none', borderRadius: '4px 4px 0 0' 
                                    }}>
                                        <select 
                                            value={font} 
                                            onChange={(e) => setFont(e.target.value)}
                                            style={{ padding: '3px', fontSize: '13px' }}
                                        >
                                            {fontOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
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
                                            <button type="button" onClick={() => setAlign('left')} style={{ padding: '4px 8px', background: align === 'left' ? '#093c71' : '#fff', color: align === 'left' ? '#fff' : '#333', border: 'none' }}><MdFormatAlignLeft /></button>
                                            <button type="button" onClick={() => setAlign('center')} style={{ padding: '4px 8px', background: align === 'center' ? '#093c71' : '#fff', color: align === 'center' ? '#fff' : '#333', border: 'none' }}><MdFormatAlignCenter /></button>
                                            <button type="button" onClick={() => setAlign('right')} style={{ padding: '4px 8px', background: align === 'right' ? '#093c71' : '#fff', color: align === 'right' ? '#fff' : '#333', border: 'none' }}><MdFormatAlignRight /></button>
                                        </div>
                                    </div>

                                    <textarea 
                                        name="subject" 
                                        value={board.subject} 
                                        onChange={changeInput} 
                                        placeholder="내용을 입력하세요"
                                        style={{ 
                                            width: '100%', minHeight: '200px', padding: '15px',
                                            fontFamily: font, textAlign: align, fontWeight: weight,
                                            border: '1px solid #ccc', borderRadius: '0 0 4px 4px', outline: 'none'
                                        }}
                                    />
                                </div>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>사진 변경</th>
                        <td>
                            <div className="file-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: '#eee', padding: '5px 10px', borderRadius: '4px' }}>
                                    <MdCloudUpload /> 파일 선택
                                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ display: 'none' }} />
                                </label>
                                {image ? (
                                    <span style={{ fontSize: '12px', color: '#2d5a3d' }}><MdCheckCircle /> 새 파일: {image.name}</span>
                                ) : (
                                    item?.originalFileName && <span style={{ fontSize: '12px', color: '#888' }}>📎 기존: {item.originalFileName}</span>
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button type="submit" className="btn-submit" disabled={submitting} style={{ padding: '10px 25px' }}>
                    {submitting ? '저장 중...' : '수정 완료'}
                </button>
                <button type="button" className="btn-cancel" onClick={onCancel} disabled={submitting} style={{ padding: '10px 25px' }}>
                    취소
                </button>
            </div>
        </form>
    );
};

export default BoardEdit;