const Bookmark = require('../models/BookmarkSchema');



exports.toggleBookmark = async(req, res) => {
    const {userId, kakaoId, matName, matTel, matAddr, lat, lng} = req.body;
    try {
        console.log("=== toggleBookmark 요청 body ===", req.body);
        const exists = await Bookmark.findOne({userId,kakaoId });
        if(exists) {
            await Bookmark.deleteOne({userId, kakaoId});
            return res.json({bookmarked:false});
        }
        await Bookmark.create({
            userId, 
            kakaoId, 
            matName, 
            matTel, // 오타 수정됨
            matAddr, 
            lat: Number(lat), // 숫자로 저장하는 것이 나중에 지도 표시할 때 편함
            lng: Number(lng)
        });
        res.json({bookmarked:true});
    } catch (err) {
        console.error("토글 에러:", err.message);
        res.status(500).json({message:err.message})
    }
}

exports.toggleArticleBookmark = async(req, res) => {
    const {userId, articleNo, title, matName} = req.body;

    console.log("req.body:", req.body);
    try {
        const exists = await Bookmark.findOne({userId, articleNo});
        if(exists) {
            await Bookmark.deleteOne({userId, articleNo});
            return res.json({bookmarked: false});
        }
        await Bookmark.create({userId, articleNo, title, matName});
        res.json({bookmarked: true});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

//전체 조회
exports.getBookmarks = async(req,res) => {
     console.log('getBookmarks 요청:', req.query); // ← 추가
    const {userId} = req.query;
    try{
        const bookmarks = await Bookmark.find({userId});
        console.log('조회 결과:', bookmarks); // ← 추가
        res.json(bookmarks);
    }catch(err){
        console.log('에러:', err.message);
        res.status(500).json({message: err.message})
    }
}

exports.deleteBookmark = async (req, res) => {
    const {id} = req.params;

    try {
        await Bookmark.findByIdAndDelete(id);
        res.json({message: '삭제 완료'});

    } catch (err) {
        res.status(500),json({message:err.message});
    }
};
//북마크 여부 확인
exports.checkBookmark = async (req, res)=> {
    const {userId, kakaoId} = req.query;
    try {
        const exists = await Bookmark.findOne({userId});
        res.json({ bookmarked: !!exists });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}
