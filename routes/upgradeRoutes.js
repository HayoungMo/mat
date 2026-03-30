const mongoose = require('mongoose')
const Upgrade = mongoose.model('upgradeRequests')

module.exports = (app) => {
    
    // 조회
    app.get('/api/upgrade', async(req, res) => {
        try {
            const upgradeUser = await Upgrade.find()
            return res.status(200).send(upgradeUser)
        } catch(error) {
            console.log('upgrade 조회 에러:', error)
            return res.status(500).send({ error: true, message: error.message })
        }
    })

    // 신청 등록
    app.post('/api/upgrade', async(req, res) => {
        try {
            const upgradeUser = await Upgrade.create(req.body)
            return res.status(200).send({ error: false, upgradeUser })
        } catch(error) {
            console.log('upgrade 등록 에러:', error)
            return res.status(500).send({ error: true, message: error.message })
        }
    })

    // 상태 수정 (수락/반려)
    app.put('/api/upgrade/:id', async(req, res) => {
        try {
            const upgraded = await Upgrade.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status },
                { new: true }
            )
            res.status(200).send({ error: false, upgraded })
        } catch(error) {
            console.log('upgrade 수정 에러:', error)
            res.status(500).send({ error: true, message: error.message })
        }
    })

    // 삭제
    app.delete('/api/upgrade', async(req, res) => {
        try {
            const upgradeUser = await Upgrade.deleteMany({userId: req.body.userId})
            return res.status(200).send({ error: false, upgradeUser })
        } catch(error) {
            return res.status(500).send({ error: true, message: error.message })
        }
    })
}