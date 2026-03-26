const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
  userId:    { type: String, required: true },
  articleNo: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
  //맛집이름, 맛집주소 추가,맛집 전화번호.
});

module.exports = mongoose.model('bookmarks', BookmarkSchema);