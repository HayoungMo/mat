const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = 4000;

const cors = require('cors');
//다른 곳에서 제(모하영) 컴퓨터로 들어올수 있게 하는 주소
app.use(cors({
    // origin: 'http://localhost:3000',
    origin: true, //개발단계에서 괜찮습니다. 
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

// 모델
require('./models/ArticleSchema.js')
require('./models/UserSchema.js')
require('./models/UpgradeRequestSchema.js')
require('./models/BookmarkSchema.js')
require('./models/ReviewSchema.js')
require('./models/FreeBoardSchema.js')

// 라우터
require('./routes/matRoutes')(app)
require('./routes/UserRoutes.js')(app)
require('./routes/bookmarkRoutes.js')(app)
require('./routes/upgradeRoutes.js')(app)
require('./routes/reviewRoutes.js')(app)
require('./routes/freeboardRoutes.js')(app)

app.get('/', (req, res) => {
    res.json({ message: 'Mat 서버 작동중입니다' });
});

app.listen(PORT, '0.0.0.0',() => {
    console.log(`서버 실행중입니다: http://localhost:${PORT}`)
});