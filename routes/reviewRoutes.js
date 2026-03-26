const mongoose = require('mongoose')
const path = require('path')

const Review = require('../models/ReviewSchema')

module.exports = (app) => {
    //데이터 조회 //리액트한테 이 주소를 보낸다.
    app.get('/api/review', async (req, res) => {
        const list = await Review.find().sort({ no: -1 })
        res.send(list)
    })

    //데이터 입력
    app.post('/api/review',async(req,res) => {
        const user = await Review.create(req.body)
        return res.status(200).send({ //데이터가 잘 넘어갔다면 200
            error:false,
            user
        })
    })


    //데이터 수정
    app.put('/api/review',async(req,res) => {
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