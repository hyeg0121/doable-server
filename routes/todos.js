const express = require('express');
const router = express.Router();
const db = require('../db/db'); 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// todo 만드는 api
router.post('/:userId', (req, res) => {
  const userId = req.params.userId;
  const { category, name, operation_type, starting_value, unit, increase_decrease_option, increase_decrease_value, start_date, end_date, completed } = req.body;

  const todoData = {
    userId,
    category,
    name,
    operation_type,
    starting_value,
    unit,
    increase_decrease_option,
    increase_decrease_value,
    start_date,
    end_date,
    completed
  };

  // todo 테이블에 insert
  db.query('INSERT INTO todos SET ?', todoData, (err, result) => {
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
  const sql = 'SELECT * FROM todo';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('user todo 조회 에러');
      res.status(500).json({ message: 'todo 조회 실패' });
    } else {
      res.status(200).json({ results });
    }
  });
});

router.get('/:userId', (req, res) => {
  const sql = 'SELECT * FROM todo WHERE user_id = ?';
  const userId = req.params.userId;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'todo 조회 실패' });
    } else {
      res.status(200).json({ results });
    }
  });
});
module.exports = router;