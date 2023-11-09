const express = require('express');
const router = express.Router();
const db = require('../db/db');
const corsMiddleware = require('../middleware/cors');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsMiddleware);

router.post('/', (req, res) => {
    const { user_id, color_code, category_name } = req.body;

    db.query(
        `INSERT INTO category (user_id, color_code, category_name) VALUES (? ,?, ?)`,
        [user_id, color_code, category_name],
        (err, results) => {
            if (err) {
                res.json({ message: '카테고리 생성 실패'});
            } else {
                res.json({ message: '카테고리 생성 성공'});
            }
        }
    );
});

router.get('/', (req, res) => {
    db.query(
        `SELECT * FROM category`,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: '카테고리 조회 실패' })
            } else {
                res.status(200).json(results);
            }
        }
    );
});

module.exports = router;