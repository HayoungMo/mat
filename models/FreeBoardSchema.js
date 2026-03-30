const mongoose = require('mongoose');


const BoardSchema = new mongoose.Schema({
    // 작성자 ID (로그인한 유저의 고유 ID)
    userId:           { type: String, required: true },

    // 게시글 제목
    title:            { type: String, required: true },

    // 게시글 타입 구분 ('text': 일반글, 'image': 맛집사진, 'survey': 맛집투표)
    type:             { type: String, enum: ['text', 'image', 'survey'], default: 'text' },

    // 게시글 본문 내용 
    // (설문 모드일 경우: '항목1^항목2^항목3' 형태로 투표 선택지를 저장)
    subject:          { type: String, default: '' },   

    // 설문조사 투표 결과 (예: [10, 5, 3] -> 각 항목별 투표수를 배열로 저장)
    votedCount:       { type: [Number], default: [] },

    // 서버에 저장된 실제 이미지 파일명 (예: 1712345678.png)
    saveFileName:     { type: String, default: '' },   

    // 사용자가 올린 원래 파일명 (예: 맛집사진.png)
    originalFileName: { type: String, default: '' },

    // 게시글 조회수
    readCount:        { type: Number, default: 0 },

    // 게시글 좋아요 총 개수
    like:             { type: Number, default: 0 },

    
    // 이 글을 북마크한 유저들의 ID를 배열로 저장합니다.
   
    isBookmarked:     { type: [String], default: [] },

    // 게시글 등록일 (기본값: 현재 시간)
    sysdate:          { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', BoardSchema);

console.log('자유게시판 정의 완료 ');