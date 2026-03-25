const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(session({
    secret: 'mat-secret-key',
    resave: false,
    saveUninitialized: false
}));

mongoose.connect('mongodb://localhost:27017/matDB')
    .then(()=> console.log('MongoDB 연결 성공'))
    .catch((err) => console.log('MongoDB 연결 실패:', err));

//라우터 연결용입니다. 주석 풀어서 사용하세요.
//const userRouters =require('./routes/userRoutes');
//app.use('/api/user',userRoutes);

app.get('/',(req,res) => {
    res.json({message: 'Mat 서버 작동중입니다'});
});

app.listen(PORT, () => {
    console.log(`서버 실행중입니다: http://localhost:${PORT}`)
});


