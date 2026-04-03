const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Board = require('../models/FreeBoardSchema');
const Comment = require('../models/CommentSchema');

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

    // [C] 글 작성
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

    // [D] 삭제 + 첨부파일 삭제 + 댓글도 함께 삭제
    app.delete('/api/freeboard/:id', async (req, res) => {
        try {
            const article = await Board.findById(req.params.id);
            if (article?.saveFileName) {
                const filePath = `uploads/${article.saveFileName}`;
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
            await Board.findByIdAndDelete(req.params.id);

            // ✅ 게시글 삭제 시 해당 댓글도 모두 삭제
            await Comment.deleteMany({ boardId: req.params.id });

            res.send({ success: true });
        } catch (err) {
            console.error('삭제 에러:', err);
            res.status(500).send({ success: false });
        }
    });

    // [U] 북마크 토글
    app.patch('/api/freeboard/:id/bookmark', async (req, res) => {
        try {
            const { userId } = req.body;
            if (!userId) return res.status(400).send({ message: "로그인이 필요합니다." });

            const board = await Board.findById(req.params.id);
            if (!Array.isArray(board.isBookmarked)) board.isBookmarked = [];

            const index = board.isBookmarked.indexOf(userId);
            if (index > -1) {
                board.isBookmarked.splice(index, 1);
            } else {
                board.isBookmarked.push(userId);
            }

            await board.save();
            res.send({ success: true, isBookmarked: board.isBookmarked, count: board.isBookmarked.length });
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


    // ============================================================
    //  💬 댓글 API (text / image 타입 전용)
    // ============================================================

    // [R] 댓글 목록 조회
    app.get('/api/freeboard/:id/comments', async (req, res) => {
        try {
            const comments = await Comment.find({
                boardId: req.params.id,
                isDeleted: false
            }).sort({ createdAt: 1 }); // 오래된 순
            res.send(comments);
        } catch (err) {
            console.error('댓글 조회 에러:', err);
            res.status(500).send([]);
        }
    });

    // [C] 댓글 등록
    app.post('/api/freeboard/:id/comments', async (req, res) => {
        try {
            const { userId, content } = req.body;

            if (!userId) return res.status(400).send({ message: "로그인이 필요합니다." });
            if (!content || !content.trim()) return res.status(400).send({ message: "댓글 내용을 입력해주세요." });

            // survey 타입엔 댓글 불가
            const post = await Board.findById(req.params.id);
            if (!post) return res.status(404).send({ message: "게시글이 없습니다." });
            if (post.type === 'survey') return res.status(400).send({ message: "설문 게시글에는 댓글을 달 수 없습니다." });

            const comment = await Comment.create({
                boardId: req.params.id,
                userId,
                content: content.trim()
            });
            res.status(201).send(comment);
        } catch (err) {
            console.error('댓글 등록 에러:', err);
            res.status(500).send({ success: false, message: err.message });
        }
    });

    // [D] 댓글 삭제 (본인만 가능)
    app.delete('/api/freeboard/:id/comments/:commentId', async (req, res) => {
        try {
            const { userId } = req.body;
            const comment = await Comment.findById(req.params.commentId);

            if (!comment) return res.status(404).send({ message: "댓글이 없습니다." });
            if (comment.userId !== userId) return res.status(403).send({ message: "본인 댓글만 삭제할 수 있습니다." });

            // 소프트 삭제
            comment.isDeleted = true;
            await comment.save();

            res.send({ success: true });
        } catch (err) {
            console.error('댓글 삭제 에러:', err);
            res.status(500).send({ success: false });
        }
    });

};