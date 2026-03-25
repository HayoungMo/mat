const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'MAT 라우터가 정상 작동합니다.' });
});

module.exports = router;