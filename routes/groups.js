const express = require('express');
const router = express.Router();
const db = require('../db/db'); // db.js 모듈 가져오기

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/groups', (req, res) => {
    const { creator_id, group_name, group_description, allow_search, group_goal, goal_name, operation_type,member_count, max_members } = req.body;
  
    const sql = 'INSERT INTO user_group (creator_id, group_name, group_description, allow_search, group_goal, goal_name, operation_type, member_count, max_members)' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
    db.query(sql, [creator_id, group_name, group_description, allow_search, group_goal, goal_name, operation_type, member_count, max_members], (err, result) => {
      if (err) {
        console.error('그룹 생성 오류:', err);
        res.status(500).json({ message: '그룹 생성 실패' });
      } else {
        
        console.log('그룹 생성 성공');
        res.status(201).json({ message: '그룹 생성 성공' , group: req.body});
      }
    });
});

module.exports = router;