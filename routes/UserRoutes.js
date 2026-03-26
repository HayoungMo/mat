const mongoose = require('mongoose');
const User = mongoose.model('users'); 

module.exports = (app) => {
  
  app.post('/api/register', async (req, res) => {
    try {
      const user = await User.create(req.body); // 
      console.log('회원가입 성공:', user.userId);
      res.send({ success: true, user });
    } catch (err) {
      console.error('회원가입 실패:', err);
      res.status(500).send({ success: false, message: "저장 실패" });
    }
  });
};
