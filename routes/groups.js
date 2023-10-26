const express = require('express');
const router = express.Router();
const db = require('../db/db'); // db.js 모듈 가져오기

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', (req, res) => {
  const { creator_id, group_name, group_description, allow_search, group_goal, goal_name, operation_type,member_count, max_members } = req.body;

  const sql = 'INSERT INTO user_group (creator_id, group_name, group_description, allow_search, group_goal, goal_name, operation_type, member_count, max_members)' +
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [creator_id, group_name, group_description, allow_search, group_goal, goal_name, operation_type, member_count, max_members], (err1, result1) => {
    if (err1) {
      console.error('그룹 생성 오류:', err1);
      res.status(500).json({ message: '그룹 생성 실패' });
    } else {
       // 가입 날짜
      const joinDate = new Date();
      console.log(result1);
      const sql2 = 'INSERT INTO group_members (user_id, group_id, join_date) VALUES (?, ?, ?)';
      db.query(sql2, [creator_id, result1.insertId, joinDate], (err2, result2) => {
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

  const sql = 'INSERT INTO group_members (user_id, group_id, join_date) VALUES (?, ?, ?)';
  db.query(sql, [groupId, userId, new Date()], (err, result) => {
    if (err) {
      res.status(500).json({ message: '그룹 가입 실패' });
    } else {
      res.status(201).json({ group_members: result});
    }
  });
});



module.exports = router;