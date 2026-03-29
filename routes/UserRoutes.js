const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app) => {

    // 회원가입
    app.post('/api/register', async (req, res) => {
        try {
            const user = await User.create(req.body);
            console.log('회원가입 성공:', user.userId);
            res.send({ success: true, user });
        } catch (err) {
            console.error('회원가입 실패:', err);
            res.status(500).send({ success: false, message: "저장 실패" });
        }
    });

    // 로그인 - 세션 저장
    app.post('/api/login', async (req, res) => {
        try {
            const { userId, password } = req.body;
            const user = await User.findOne({ userId });

            if (!user) return res.send({ success: false, message: "존재하지 않는 아이디입니다." });

            if (user.password === password) {
                // 세션에 저장
                req.session.user = { userId: user.userId };
                console.log('로그인 성공 - 세션 저장:', user.userId);
                res.send({ success: true, userId: user.userId });
            } else {
                res.send({ success: false, message: "비밀번호가 일치하지 않습니다." });
            }
        } catch (err) {
            console.error('로그인 서버 에러:', err);
            res.status(500).send({ success: false, message: "서버 오류 발생" });
        }
    });

    // 로그아웃 - 세션 제거
    app.post('/api/logout', (req, res) => {
        req.session.destroy(() => {
            res.send({ success: true });
        });
    });

    // 현재 로그인 유저 확인
    app.get('/api/me', (req, res) => {
        if (req.session.user) {
            res.send({ success: true, userId: req.session.user.userId });
        } else {
            res.send({ success: false, userId: null });
        }
    });
};