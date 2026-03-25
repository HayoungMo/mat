const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
  userId:    { type: String, required: true },
  articleNo: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('bookmarks', BookmarkSchema);