const Notice = require('../models/NoticeSchema');

module.exports = (app) => {
    // 1. 공지사항 전체 목록 가져오기 (최신순)
    app.get('/api/notice', async (req, res) => {
        try {
            const notices = await Notice.find().sort({ createdAt: -1 });
            res.json(notices);
        } catch (err) {
            res.status(500).json({ message: "목록 불러오기 실패", err });
        }
    });

    // 2. 공지사항 등록
    app.post('/api/notice', async (req, res) => {
        try {
            const newNotice = await Notice.create(req.body);
            res.json({ success: true, newNotice });
        } catch (err) {
            res.status(500).json({ success: false, message: "등록 실패" });
        }
    });

    // 3. 공지사항 삭제
    app.delete('/api/notice/:id', async (req, res) => {
        try {
            await Notice.findByIdAndDelete(req.params.id);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, message: "삭제 실패" });
        }
    });

    // 4. 공지사항 수정
    app.put('/api/notice/:id', async (req, res) => {
        try {
            await Notice.findByIdAndUpdate(req.params.id, req.body);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, message: "수정 실패" });
        }
    });
};
