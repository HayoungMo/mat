const mongoose = require('mongoose');

const USerSchema = mongoose.Schema({
    userId: {type: String, require:true, unique: true},
    password:  { type: String, required: true },
    tel:       { type: String, required: true },
    email:     { type: String },
    addr:      { type: String },
    role:      { type: String, default: 'user', enum: ['user', 'city', 'admin'] },
    createdAt: { type: Date, default: Date.now }
});

//모델 중복으로 인해서 exportt만 살려뒀습니다
module.exports = mongoose.model('users', USerSchema);


//server.js or routes/ 에서 불러올때 
//const USer = require(./models/UserSchema); 