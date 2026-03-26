

import React from 'react';
import { FcLike } from "react-icons/fc";
import numeral from 'numeral';

const BoardItem = ({ item, onBack, onEdit, onDelete }) => {
    // 1. 데이터가 없을 경우를 대비한 안전장치
    if (!item) return null;

    // 스키마 구조에 맞춰서 변수 추출 (images는 배열임) [cite: 25]
    const {
        no, userId, cityName, title, subject,
        region, matName, sysdate, images,
        opt1, opt2, opt3 // 설문 옵션들
    } = item;

    // 2. 이미지 처리: images 배열의 첫 번째 객체에서 saveFileName을 가져옴 [cite: 31, 32]
    const saveFileName = images && images.length > 0 ? images[0].saveFileName : null;
    const hasImage = Boolean(saveFileName);
    
    // 설문조사 여부 체크 [cite: 27]
    const isSurvey = Boolean(opt1);

    return (
        <table border="1" style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: '#fff', border: '1px solid #ddd' }}>
            <tbody>
                {/* 1행: 번호 및 지역 태그 [cite: 28] */}
                <tr>
                    <td style={{ padding: '10px' }}>
                        <span>No. {no}</span>
                        <span style={{ float: 'right', color: '#2d5a3d', fontWeight: 'bold' }}>#{region}</span>
                    </td>
                </tr>

                {/* 2행: 제목 및 작성 정보 [cite: 29] */}
                <tr>
                    <td style={{ padding: '15px' }}>
                        <strong style={{ fontSize: '18px' }}>{title}</strong><br />
                        <small style={{ color: '#666' }}>{userId} | {cityName} | {new Date(sysdate).toLocaleDateString()}</small>
                    </td>
                </tr>

                {/* 3행: 이미지 (배열의 첫 번째 이미지를 출력) [cite: 30, 31, 32] */}
                {hasImage && (
                    <tr>
                        <td style={{ textAlign: 'center', padding: '20px' }}>
                            <img 
                                src={`http://localhost:4000/uploads/${saveFileName}`} 
                                alt={matName || title} 
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} 
                            />
                        </td>
                    </tr>
                )}

                {/* 4행: 본문 내용 또는 설문조사 [cite: 34, 35, 39] */}
                <tr>
                    <td style={{ padding: '20px', minHeight: '150px' }}>
                        {isSurvey ? (
                            /* 설문형 데이터일 때 [cite: 35, 36] */
                            <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>📊 맛집 투표</p>
                                {[opt1, opt2, opt3].filter(Boolean).map((opt, i) => (
                                    <div key={i} style={{ marginBottom: '8px' }}>
                                        <input type="radio" name="survey" id={`opt${i}`} disabled />
                                        <label htmlFor={`opt${i}`}> {opt}</label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* 일반 줄글 데이터일 때 [cite: 39] */
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                {subject || "내용이 없습니다."}
                            </div>
                        )}
                    </td>
                </tr>

                {/* 5행: 맛집 이름 및 하단 버튼 섹션 [cite: 41, 42] */}
                <tr>
                    <td style={{ padding: '15px' }}>
                        <div style={{ marginBottom: '10px' }}>📍 {matName}</div>
                        <hr style={{ border: '0', borderTop: '1px solid #eee' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <div>
                                <FcLike /> <span style={{ verticalAlign: 'middle' }}>{numeral(1234).format('0,0')}</span>
                            </div>
                            
                            {/* 관리 버튼 모음 */}
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button 
                                    onClick={() => onEdit(item)} 
                                    style={{ cursor: 'pointer', padding: '5px 12px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}
                                >수정</button>
                                <button 
                                    onClick={() => onDelete(item._id)} 
                                    style={{ cursor: 'pointer', padding: '5px 12px', backgroundColor: '#fff', border: '1px solid #ffab91', color: '#d84315', borderRadius: '4px' }}
                                >삭제</button>
                                <button 
                                    onClick={onBack} 
                                    style={{ cursor: 'pointer', padding: '5px 12px', backgroundColor: '#2d5a3d', color: '#fff', border: 'none', borderRadius: '4px' }}
                                >목록으로</button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default BoardItem;