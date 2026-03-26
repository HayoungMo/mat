const mongoose = require('mongoose');

const FreeBoardSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String},
  subject: { type: String, required: true },

  //article스키마 참조
  images: [
    {
      saveFileName:     { type: String, required: true },
      originalFileName: { type: String, required: true }
    }
  ],
  type:{ type: String}
});
//모델 중복으로 인해서 exportt만 살려뒀습니다
console.log('자유게시판 정의')

module.exports = mongoose.model('freeboards', FreeBoardSchema);