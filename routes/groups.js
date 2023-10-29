const express = require('express');
const router = express.Router();
const db = require('../db/db'); // db.js 모듈 가져오기
const corsMiddleware = require('../middleware/cors');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsMiddleware);

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM user_group';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('그룹 조회 오류:', err);
      res.status(500).json({ message: '그룹 조회 실패' });
    } else {
      console.log('그룹 조회 성공');
      res.status(200).json({ groups: results });
    }
  });
});

// post
router.post('/', (req, res) => {
  const { creator_id, group_name, group_description, allow_search, goal_name, operation_type, member_count, unit } = req.body;

  const sql = 'INSERT INTO user_group (creator_id, group_name, group_description, allow_search, goal_name, operation_type, member_count, unit)' +
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [creator_id, group_name, group_description, allow_search, goal_name, operation_type, member_count, unit], (err1, result1) => {
    if (err1) {
      console.error('그룹 생성 오류:', err1);
      res.status(500).json({ message: '그룹 생성 실패' });
    } else {
      console.log(result1);
      const sql2 = 'INSERT INTO group_member (user_id, group_id, join_date) VALUES (?, ?, now())';
      db.query(sql2, [creator_id, result1.insertId], (err2, result2) => {
        if (err2) {
          console.error('멤버 추가 오류:', err2);
          res.status(500).json({ message: '멤버 추가 오류' });
        } else {
          console.log('멤버 추가 성공');
          res.status(201).json({ group: req.body, group_members: result2});
        }
      });

      console.log('그룹 생성 성공');
    }
  }); 
});

router.post('/:groupId/user/:userId', (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;

  // 먼저 해당 사용자가 이미 그 그룹에 가입되어 있는지 확인
  const checkMembershipSql = 'SELECT * FROM group_members WHERE user_id = ? AND group_id = ?';
  db.query(checkMembershipSql, [userId, groupId], (checkErr, checkResults) => {
    if (checkErr) {
      res.status(500).json({ message: '그룹 가입 실패' });
    } else if (checkResults.length > 0) {
      // 이미 가입한 경우, 가입 실패 반환
      res.status(400).json({ message: '이미 그룹에 가입되어 있습니다.' });
    } else {
      // 그룹에 가입되어 있지 않은 경우, 가입 처리
      const sql = 'INSERT INTO group_members (user_id, group_id, join_date) VALUES (?, ?, ?)';
      db.query(sql, [userId, groupId, new Date()], (err, result) => {
        if (err) {
          res.status(500).json({ message: '그룹 가입 실패' });
        } else {
          res.status(201).json({ message: '그룹 가입 성공' });
        }
      });
    }
  });
});


router.delete('/:groupId', (req, res) => {
  const groupId = req.params.groupId;

  // MySQL 데이터베이스에서 그룹 삭제
  const sql = 'DELETE FROM user_group WHERE id = ?';

  db.query(sql, [groupId], (err, result) => {
    if (err) {
      console.error('그룹 삭제 오류:', err);
      res.status(500).json({ message: '그룹 삭제 실패' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: '그룹을 찾을 수 없음' });
    } else {
      console.log('그룹 삭제 성공');
      res.status(200).json({ message: '그룹 삭제 성공' });
    }
  });
});




module.exports = router;