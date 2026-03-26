const exprres = require("express")
const router = exprres.Router();
const controller = require("../controllers/bookmarkController");

// 북마크 추가
router.post("/", controller.addBookmark);

// 북마크 삭제
router.delete("/", controller.removeBookmark);

// 북마크 조회
router.get("/", controller.getBookmarks);

// 북마크 토글
router.post("/toggle", controller.toggleBookmark);

module.exports = router;