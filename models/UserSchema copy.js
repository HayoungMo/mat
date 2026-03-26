const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  
  userId:   { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  tel:      { type: String },
  email:    { type: String },
  addr:     { type: String },
  birth:    { type: String },
  sysdate:  { type: Date, default: Date.now } 
});

module.exports = mongoose.model('users', UserSchema);
