const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    rank:     { type: Number },                  
    title:    { type: String, required: true },   
    content:  { type: String, required: true },   
    writer:   { type: String, default: '관리자' }, 
    category: { type: String, default: '공지' },  
    state:    { type: String, default: '신규' },  
    date:     { type: String, default: () => new Date().toLocaleDateString() }, 
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Notice', NoticeSchema);
