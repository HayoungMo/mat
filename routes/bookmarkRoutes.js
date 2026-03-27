const exprres = require("express")
const router = exprres.Router();
const path = require('path');
const controller  = require('../controller/bookmarkController');



router.get('/', controller.getBookmarks);

// 북마크 토글
router.post('/toggle', controller.toggleBookmark);

// 북마크 여부 확인
router.get('/check', controller.checkBookmark);

module.exports = (app) => {
    app.use('/api/bookmarks', router);


};
