const express = require('express');
const router = express.Router();
const db = require('../db/db'); // db.js 모듈 가져오기

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/:id', (req, res) => {
    const userId = req.params.id;
  
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('유저 조회 오류: ', err);
        res.status(500).json({ message: '유저 조회 실패'});
      } else if (results.length === 0) {
        res.status(404).json({ message: '유저를 찾을 수 없음'});
      } else {
        const user = results[0];
        res.status(200).json({ message: '유저 조회 성공', user});
      }
    });
});
  
router.get('/:userId/groups', async (req, res) => {
    const id = req.params.userId;
    const sql = 'SELECT * FROM user_group WHERE creator_id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
        console.error('검색 오류: ', err);
        res.status(500).json({ message: '데이터를 찾을 수 없음'});
        } else {
        console.log('검색 성공')
        res.status(200).json({ groups: results});
        }
    });
});

module.exports = router;
  