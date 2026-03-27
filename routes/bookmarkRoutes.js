const exprres = require("express")
const router = exprres.Router();
const path = require('path');
const service = require(path.join(__dirname, '../services/bookmarkService'));



// 북마크 조회

router.get('/', async (req, res) => {
    const { userId } = req.query;
    try {
        const bookmarks = await service.getBookmarks(userId);
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 북마크 토글
router.post('/toggle', async (req, res) => {
    const { userId, kakaoId, matName, matTel, matAddr, lat, lng } = req.body;
    try {
        const result = await service.toggleBookmark(userId,{  // ← 객체로 묶어서 전달
            kakaoId, matName, matTel, matAddr, lat, lng
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = (app) => {
    app.use('/api/bookmarks', router);
}
