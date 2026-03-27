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

  // 프로필 조회
  app.get('/api/profile', async (req, res) => {
    try {
      const user = await User.find()
      res.send(user)
    } catch (err) {
      console.error('프로필 조회 실패:', err)
      res.status(500).send({ success: false, message: '조회 실패' })
    }
  });

  //프로필 수정
     app.put('/api/profile', async (req, res) => {
    try {
      console.log('받은 데이터:',req.body)
        const user = await User.findOneAndUpdate(
            req.body.id,
            { tel: req.body.tel, email: req.body.email },
            { new: true }
        )
        console.log('수정된 유저:',user)
        return res.status(200).send({ error: false, user })
    } catch (err) {
        console.error('프로필 수정 실패:', err)
        res.status(500).send({ success: false, message: '수정 실패' })
    }
})
  

};
