const mongoose = require('mongoose')
const path = require('path')

const Review = require('../models/ReviewSchema')

module.exports = (app) => {

    //데이터 일부 조회(article no사용)
    app.get('/api/review/article/:aNo', async(req, res) => {
    try {
        const list = await Review.find({ aNo: Number(req.params.aNo) }).sort({ createdAt: -1 })
        res.send(list)
    } catch(error) {
        res.status(500).send({ error: true, message: error.message })
    }
    })
    //데이터 조회 //리액트한테 이 주소를 보낸다.
    app.get('/api/review/:userId', async (req, res) => {
        const {userId} = req.params
        const list = await Review.find({userId: userId}).sort({ no: -1 })
        res.send(list)
    })

    //데이터 입력
    app.post('/api/review/:userId',async(req,res) => {
        const user = await Review.create(req.body)
        return res.status(200).send({ //데이터가 잘 넘어갔다면 200
            error:false,
            user
        })
    })


    //데이터 수정
    app.put('/api/review/:userId',async(req,res) => {
        const {userId} = req.params
        const id = req.body.id //req.body에서 넘어온 id
        const user = await Review.findByIdAndUpdate(id,req.body)//id,value
        return res.status(200).send({ //데이터가 잘 넘어갔다면 200
            error:false,
            user
        })
    })

    //데이터 삭제
    app.delete('/api/review',async(req,res) => {
        const id = req.body.id
        const user = await Review.findByIdAndDelete(id)//id만 필요
        return res.status(200).send({ //데이터가 잘 넘어갔다면 200
            error:false,
            user
        })
    })


}