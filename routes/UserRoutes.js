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
      app.put('/api/profile',async(req,res) => {
          const id = req.body.id //req.body에서 넘어온 id
          const user = await Profile.findByIdAndUpdate(id,req.body)//id,value
          return res.status(200).send({ //데이터가 잘 넘어갔다면 200
              error:false,
              user
          })
      })
  

};
