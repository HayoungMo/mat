const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  userId:    { type: String, required: true },
  aNo:       { type: Number, required: true },
  content:   { type: String, required: true },
  rating:    { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('reviews', ReviewSchema);