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

  app.post('/api/login', async (req, res) => {
    try {
      const { userId, password } = req.body; 

      const user = await User.findOne({ userId: userId });

      if (!user) {
        
        return res.send({ success: false, message: "존재하지 않는 아이디입니다." });
      }

      if (user.password === password) {
          console.log('로그인 성공:', user.userId);
          res.send({ success: true, userId: user.userId }); // 리액트가 기다리는 형식
      } else {
          res.send({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }

    } catch (err) {
      console.error('로그인 서버 에러:', err);
      res.status(500).send({ success: false, message: "서버 오류 발생" });
    }
  });
};


