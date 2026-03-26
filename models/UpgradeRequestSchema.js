const mongoose = require('mongoose');

const UpgradeRequestSchema = mongoose.Schema({
  userId:    { type: String, required: true },
  cityName:  { type: String, required: true },
  reason:    { type: String },
  status:    { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  createdAt: { type: Date, default: Date.now }
});

//모델 중복으로 인해서 exportt만 살려뒀습니다
console.log('등급 모델 정의')
module.exports = mongoose.model('upgradeRequests', UpgradeRequestSchema);