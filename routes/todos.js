const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// todo 만드는 api
router.post('/:userNo', (req, res) => {
  const userNo = req.params.userNo;
  const { category, todo_name, operation_type, starting_value, unit, increase_decrease_option, increase_decrease_value, start_date, end_date, completed } = req.body;

  const todoData = [
    userNo,
    category,
    todo_name,
    operation_type,
    starting_value,
    unit,
    increase_decrease_option,
    increase_decrease_value,
    start_date,
    end_date,
    completed
  ];

  // todo 테이블에 insert
  db.query(`INSERT INTO todo (user_no, category, todo_name, operation_type, starting_value, unit, increase_decrease_option, increase_decrease_value, start_date, end_date, completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, todoData, (err, result) => {
    if (err) {
      console.error('Todo 생성 에러', err);
      res.status(500).json({ message: 'Todo 생성 실패' });
    } else {
      const todoId = result.insertId;
      res.status(201).json({ message: 'Todo 생성 성공', todoId });
    }
  });
});


router.get('/', (req, res) => {
  db.query(`SELECT * FROM todo`, (err, results) => {
    if (err) {
      console.error('user todo 조회 에러');
      res.status(500).json({ message: 'todo 조회 실패' });
    } else {
      res.status(200).json({ results });
    }
  });
});

router.get('/:userNo', (req, res) => {
  const userNo = req.params.userNo;
  db.query(`SELECT * FROM todo WHERE user_id = ?`, [userNo], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'todo 조회 실패' });
    } else {
      res.status(200).json({ results });
    }
  });
});
module.exports = router;