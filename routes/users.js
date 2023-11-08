const express = require('express');
const router = express.Router();
const db = require('../db/db');
const corsMiddleware = require('../middleware/cors');
const { runInContext } = require('vm');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsMiddleware);

// 아이디로 유저 조회하기 
router.get('/', (req, res) => {
  db.query(`SELECT * FROM user`,
    (err, results) => {
      if (err) {
        console.error('유저 조회 오류: ', err);
        res.status(500).json({ message: '유저 조회 실패'});
      } else {
        res.status(200).json({users: results});
      }
    }
  );
});


router.get('/:id', (req, res) => {
  const userNo = req.params.id;

  db.query(`SELECT * FROM user WHERE user_no = ?`, [userNo], (err, results) => {
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
  
// 유저가 만든 그룹 조회하기 
router.get('/:userNo/groups', async (req, res) => {
    const userNo = req.params.userNo;

    db.query(`SELECT * FROM group_member WHERE user_no = ?`, [userNo], (err, results) => {
      if (err) {
          console.error('검색 오류: ', err);
          res.status(500).json({ message: '데이터를 찾을 수 없음'});
      } else {
          console.log('검색 성공')
          res.status(200).json({ groups: results });
      }
  });
});



module.exports = router;
  