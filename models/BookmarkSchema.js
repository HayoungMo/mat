const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
  userId:    { type: String, required: true },
  articleNo: { type: Number},//칼럼 북마크용도
  kakaoId:   { type: String },// 지도 북마크
  matName:   { type: String },
  matTel:    { type: String },
  matAddr:   { type: String },
  lat:       { type: Number },
  lng:       { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('bookmarks', BookmarkSchema);