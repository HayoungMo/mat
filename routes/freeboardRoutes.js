const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Board = require('../models/FreeBoardSchema'); // ← 파일명에 맞게 수정

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads'); },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

module.exports = (app) => {

    // [R] 목록 조회 + 키워드 검색
    app.get('/api/freeboard', async (req, res) => {
        try {
            const { keyword } = req.query;
            const query = keyword ? { title: new RegExp(keyword, 'i') } : {};
            const list = await Board.find(query).sort({ sysdate: -1 });
            res.send(list);
        } catch (err) {
            console.error('목록 조회 에러:', err);
            res.status(500).send([]);
        }
    });

    // [R] 상세 조회 + 조회수 증가
    app.get('/api/freeboard/:id', async (req, res) => {
        try {
            const article = await Board.findByIdAndUpdate(
                req.params.id,
                { $inc: { readCount: 1 } },
                { new: true }
            );
            res.send(article);
        } catch (err) {
            console.error('상세 조회 에러:', err);
            res.status(500).send(null);
        }
    });

    // [C] 글 작성 ('images' 로 프론트와 일치)
    app.post('/api/freeboard', upload.single('images'), async (req, res) => {
        try {
            const boardData = { ...req.body };
            if (!boardData.subject) boardData.subject = '';
            if (req.file) {
                boardData.saveFileName = req.file.filename;
                boardData.originalFileName = Buffer.from(
                    req.file.originalname, 'latin1'
                ).toString('utf-8');
            }
            const article = await Board.create(boardData);
            res.status(201).send({ success: true, article });
        } catch (err) {
            console.error('서버 등록 에러:', err);
            res.status(500).send({ success: false, message: err.message });
        }
    });

    // [U] 글 수정
    app.put('/api/freeboard/:id', upload.single('images'), async (req, res) => {
        try {
            const updateData = { ...req.body };
            if (req.file) {
                const old = await Board.findById(req.params.id);
                if (old?.saveFileName) {
                    const oldPath = `uploads/${old.saveFileName}`;
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                updateData.saveFileName = req.file.filename;
                updateData.originalFileName = Buffer.from(
                    req.file.originalname, 'latin1'
                ).toString('utf-8');
            }
            const updated = await Board.findByIdAndUpdate(
                req.params.id, updateData, { new: true }
            );
            res.send({ success: true, article: updated });
        } catch (err) {
            console.error('수정 에러:', err);
            res.status(500).send({ success: false, message: err.message });
        }
    });

    // [D] 삭제 + 첨부파일 같이 삭제
    app.delete('/api/freeboard/:id', async (req, res) => {
        try {
            const article = await Board.findById(req.params.id);
            if (article?.saveFileName) {
                const filePath = `uploads/${article.saveFileName}`;
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
            await Board.findByIdAndDelete(req.params.id);
            res.send({ success: true });
        } catch (err) {
            console.error('삭제 에러:', err);
            res.status(500).send({ success: false });
        }
    });

    // [U] 북마크 토글
        app.patch('/api/freeboard/:id/bookmark', async (req, res) => {
            try {
                const { userId } = req.body; // 클라이언트에서 보낸 로그인 유저 ID
                if (!userId) return res.status(400).send({ message: "로그인이 필요합니다." });

                const board = await Board.findById(req.params.id);
                
                // 1. 배열이 아니면 배열로 초기화 (방어 코드)
                if (!Array.isArray(board.isBookmarked)) {
                    board.isBookmarked = [];
                }

                // 2. 이미 내 아이디가 배열에 있는지 확인
                const index = board.isBookmarked.indexOf(userId);

                if (index > -1) {
                    // 이미 있다면 삭제 (북마크 해제)
                    board.isBookmarked.splice(index, 1);
                } else {
                    // 없다면 추가 (북마크 등록)
                    board.isBookmarked.push(userId);
                }

                await board.save();
                res.send({ 
                    success: true, 
                    isBookmarked: board.isBookmarked, // 전체 배열 반환
                    count: board.isBookmarked.length 
                });
            } catch (err) {
                console.error('북마크 에러:', err);
                res.status(500).send({ success: false });
            }
        });

    // [U] 투표 처리 + 3일 마감 체크
    app.patch('/api/freeboard/:id/vote', async (req, res) => {
        try {
            const board = await Board.findById(req.params.id);
            const isClosed = (new Date() - new Date(board.sysdate)) > 3 * 24 * 60 * 60 * 1000;
            if (isClosed) return res.status(400).send({ message: "투표가 마감되었습니다." });

            const { index } = req.body;
            if (!board.votedCount.length) {
                let optCount = 2;
                try {
                    const parsed = JSON.parse(board.subject);
                    if (Array.isArray(parsed)) optCount = parsed.length;
                } catch {
                    optCount = board.subject.split('^').filter(Boolean).length;
                }
                board.votedCount = new Array(optCount).fill(0);
            }
            board.votedCount[index] = (Number(board.votedCount[index]) || 0) + 1;
            board.markModified('votedCount');
            await board.save();
            res.send({ success: true, votedCount: board.votedCount });
        } catch (err) {
            console.error('투표 에러:', err);
            res.status(500).send({ success: false });
        }
    });
};