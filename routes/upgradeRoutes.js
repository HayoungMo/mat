const mongoose = require('mongoose')

//DB 작명
const Upgrade = mongoose.model('upgradeRequests')

//미들 웨어 생성하기

module.exports= (app)=>{
    // 조회
    app.get('/api/upgrade',async(req,res)=>{
        const upgradeUser = await Upgrade.find()
        return res.status(200).send(upgradeUser)
    })

    app.get('/api/upgrade/id',async(req,res)=>{
        const userId = req.body.userId
        const upgradeUser = await Upgrade.findOne({userId})
        return res.status(200).send(upgradeUser)
    })

    // 데이터 입력
    app.post('/api/upgrade',async(req,res)=>{
        const upgradeUser = await Upgrade.create(req.body)
        return res.status(200).send({
            error:false,
            upgradeUser
        })
    })

    // 데이터 수정
    app.put('/api/upgrade',async(req,res)=>{
        const userId = req.body.userId
        const upgradeUser = await Upgrade.findByIdAndUpdate(userId)
        return res.status(200).send({
            error:false,
            upgradeUser
        })
    })
    
    // 데이터 삭제
    app.delete('/api/upgrade',async(req,res)=>{
        const userId = req.body.userId
        const upgradeUser = await Upgrade.findByIdAndDelete(userId)
        return res.status(200).send({
            error:false,
            upgradeUser
        })
    })
}