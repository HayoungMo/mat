const Bookmark = require('../models/BookmarkSchema');
//토글

exports.toggleBookmark = async(req, res) => {
    const {userId, kakaoId, matName, metTel, matAddr, lat, lng} = req.body;
    try {
        const exists = await Bookmark.findeOne({userId,kakaoId });
        if(exists) {
            await Bookmark.deleteOne({userId, kakaoId});
            return res.json({bookmarked:false});
        }
        await Bookmark.create({userId, kakaoId, matName, metTel, metAddr, lat, lng});
        res.json({bookmarked:true});
    } catch (err) {
        res.status(500).json({message:err.message})
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