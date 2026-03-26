const Bookmark = require('../models/BookmarkSchema');

// 북마크 토글
const toggleBookmark = async (userId, placeInfo) => {
    const { kakaoId, matName, matTel, matAddr, lat, lng } = placeInfo;

    const exists = await Bookmark.findOne({ userId, kakaoId });
    if (exists) {
        await Bookmark.deleteOne({ userId, kakaoId });
        return { bookmarked: false };
    }

    await Bookmark.create({ userId, kakaoId, matName, matTel, matAddr, lat, lng });
    return { bookmarked: true };
};

// 북마크 전체 조회
const getBookmarks = async (userId) => {
    return Bookmark.find({ userId });
    
};

// 북마크 여부 확인
const checkBookmark = async (userId, kakaoId) => {
    const exists = await Bookmark.findOne({ userId, kakaoId });
    return !!exists;
};

module.exports = { toggleBookmark, getBookmarks, checkBookmark };