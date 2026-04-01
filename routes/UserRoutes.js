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
          res.send({ success: true, userId: user.userId, user:user }); // 리액트가 기다리는 형식
      } else {
          res.send({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }

    } catch (err) {
      console.error('로그인 서버 에러:', err);
      res.status(500).send({ success: false, message: "서버 오류 발생" });
    }
  });

  app.put('/api/users/:userId/role',async(req,res)=>{
      try{
        const user = await User.findOneAndUpdate(
          {userId: req.params.userId},
          {role: req.body.role},
          {new:true}
        )

        res.status(200).send({error:false,user})
        
      }catch(error){
        res.status(500).send({error : true, message: error.message})
      }
  })

  //모하영 3월 30일 프로필 조회, 프로필 수정, 회원 탈퇴

  //프로필 조회
  app.get('/api/profile/:userId', async (req,res) => {
    try{
      const user = await User.findOne({userId:req.params.userId})
      if(!user) return res.status(404).send({error:true,message: '유저 없음'})
      return res.status(200).send(user)
    } catch (error){
      return res.status(500).send({error:true,message:error.message})
    }
  })
  //프로필 수정
  app.put('/api/profile', async (req,res) => {
    try{

      const {id,currentPassword,newPassword, tel, email} = req.body

      //1. db에서 유저 찾기
      const user = await User.findById(id)
      if(!user) return res.status(404).send({error: true,message:'유저 없음'})

      //2. 비번 검사
      if(user.password!=currentPassword){
        return res.status(401).send({ error: true, message: '현재 비밀번호가 일치하지 않습니다.' })
      }

      //3. 업데이트 할 정보 구성 (새 비밀번호 -> 변경 기존 -> 유지)
      const updateData = {tel,email}
      if(newPassword){
        updateData.password=newPassword
      }

      //4. 정보 업데이트(기존에 존재)
      const updated = await User.findByIdAndUpdate(id,updateData,{new:true})
      return res.status(200).send(updated)

    } catch (error){
      return res.status(500).send({error:true,message:error.message})
    }
  })

  //회원 탈퇴
  app.delete('/api/profile',async (req,res) => {
    try {
      await User.findByIdAndDelete(req.body.id)
      return res.status(200).send({error:false})
    } catch (error) {
      return res.status(500).send({ error:true, message:error.message})
    }
  })


};