const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = 4000;

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(session({
    secret: 'mat-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use('/uploads', express.static('uploads'))

mongoose.connect('mongodb://localhost:27017/matDB')
    .then(()=> console.log('MongoDB 연결 성공'))
    .catch((err) => console.log('MongoDB 연결 실패:', err));

//라우터 연결용입니다. 주석 풀어서 사용하세요.

//1. 모델   
require('./models/ArticleSchema.js')
require('./models/UserSchema.js')
require('./models/UpgradeRequestSchema.js')



//2. 라우터
require('./routes/matRoutes')(app)
require('./routes/UserRoutes.js')(app)
require('./routes/bookmarkRoutes.js')(app)
require('./routes/upgradeRoutes.js')(app)

//3. 리뷰(Review)
require('./models/ReviewSchema.js')
require('./routes/reviewRoutes.js')(app)

app.get('/',(req,res) => {
    res.json({message: 'Mat 서버 작동중입니다'});
});

//4. 프로필(Profile)
require('./models/UserSchema.js')
require('./routes/UserRoutes.js')(app)

app.listen(PORT, () => {
    console.log(`서버 실행중입니다: http://localhost:${PORT}`)
});


app.get('/',(req,res) => {
    res.json({message: 'Mat 서버 작동중입니다'});
});

app.listen(PORT, () => {
    console.log(`서버 실행중입니다: http://localhost:${PORT}`)
});