const mongoose = require('mongoose');

const FreeBoardSchema = mongoose.Schema({
    userId: { type: String, required: true },          // 작성자 ID
    title: { type: String, required: true },           // 게시글 제목
    type: { 
        type: String, 
        enum: ['text', 'image', 'survey'], 
        default: 'text' 
    },                                                 // 게시글 타입 (분기 처리용)
    subject: { type: String, required: true },         // 내용 (일반글은 본문, 설문은 '항목1^항목2' 형태)
    
    // 📊 설문 전용 필드 (추가 권장)
    votedCount: { 
        type: [Number], 
        default: [] 
    },                                                 // [10, 5, 3] 처럼 항목별 투표수 저장
    
    // 🖼️ 이미지 관련 필드
    saveFileName: { type: String, default: '' },       // 서버 저장 파일명
    originalFileName: { type: String, default: '' },   // 원본 파일명
    
    // 📈 통계 및 기타
    readCount: { type: Number, default: 0 },           // 조회수 (count 대신 직관적인 이름 추천)
    like: { type: Number, default: 0 },                // 좋아요 수 (Number 타입 추천)
    sysdate: { type: Date, default: Date.now }  
});
//모델 중복으로 인해서 exportt만 살려뒀습니다
console.log('자유게시판 정의')

module.exports = mongoose.model('freeboards', FreeBoardSchema);