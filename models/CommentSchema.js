const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    // 어느 게시글의 댓글인지 (FreeBoardPost._id 참조)
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
        index: true          // boardId 기준 조회가 많으므로 인덱스 설정
    },

    // 댓글 작성자 ID
    userId: {
        type: String,
        required: true
    },

    // 댓글 내용
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },

    // 소프트 삭제 (삭제된 댓글 → "삭제된 댓글입니다." 처리 가능)
    isDeleted: {
        type: Boolean,
        default: false
    },

    // 작성일
    createdAt: {
        type: Date,
        default: Date.now
    },

    // 수정일
    updatedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Comment', CommentSchema);

console.log('Comment 스키마 정의 완료');