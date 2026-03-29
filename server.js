const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = 4000;

// 1. 미들웨어 설정
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // ← 이 줄 추가!
app.use(session({
    secret: 'mat-secret-key',
    resave: false,
    saveUninitialized: false
}));

// 2. MongoDB 연결
mongoose.connect('mongodb://localhost:27017/matDB')
    .then(() => console.log('MongoDB 연결 성공'))
    .catch((err) => console.log('MongoDB 연결 실패:', err));

require('./models/ArticleSchema.js');
require('./models/UserSchema.js');
require('./models/UpgradeRequestSchema.js');
require('./models/FreeBoardSchema.js'); 


require('./routes/matRoutes')(app);
require('./routes/UserRoutes.js')(app);
require('./routes/bookmarkRoutes.js')(app);
require('./routes/upgradeRoutes.js')(app);
require('./routes/freeboardRoutes.js')(app); 
// 5. 기본 경로
app.get('/', (req, res) => {
    res.json({ message: 'Mat 서버 작동중입니다' });
});

// 6. 서버 시작
app.listen(PORT, () => {
    console.log(`서버 실행중입니다: http://localhost:${PORT}`);
});