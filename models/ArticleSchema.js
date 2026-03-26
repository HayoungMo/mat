const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
  no:               { type: Number, required: true, unique: true },
  userId:           { type: String, required: true },
  cityName:         { type: String, required: true },
  title:            { type: String, required: true },
  subject:          { type: String, required: true },
  region:           { type: String, required: true },
  matName:          { type: String },
  matTel:           { type: String },
  matAddr:          { type: String},

  images: [
    {
      saveFileName:     { type: String, required: true },
      originalFileName: { type: String, required: true }
    }
  ],
  sysdate:          { type: Date, default: Date.now }
});
//모델 중복으로 인해서 exportt만 살려뒀습니다
console.log('맛집 모델 정의')

module.exports = mongoose.model('articles', ArticleSchema);