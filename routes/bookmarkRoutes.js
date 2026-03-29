const express = require("express")
const router = express.Router();
const path = require('path');
const controller  = require('../controller/bookmarkController');

console.log("bookmarkRoutes 로드됨");

router.get('/', controller.getBookmarks);

// 북마크 토글
router.post('/toggle', controller.toggleBookmark);

router.post('/toggleArticle', controller.toggleArticleBookmark);

// 북마크 여부 확인
router.get('/check', controller.checkBookmark);

module.exports = (app) => {
    app.use('/api/bookmarks', router);
};
