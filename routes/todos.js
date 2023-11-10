const express = require('express');
const router = express.Router();
const db = require('../db/db');
const corsMiddleware = require('../middleware/cors');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsMiddleware);

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
  db.query(`INSERT INTO todo (user_no, category_id, todo_name, operation_type, starting_value, unit, increase_decrease_option, increase_decrease_value, start_date, end_date, completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, todoData, (err, result) => {
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
  db.query(
    `SELECT todo.*, category.category_name, category.color_code FROM todo
    INNER JOIN category ON todo.category_id = category.id
    WHERE todo.user_no = ?;`,
    [userNo],
    (err, results) => {
      if (err) {
        res.status(500).json({ message: 'todo 조회 실패' });
      } else {
        // 여기에서 결과를 가공하여 원하는 형식으로 반환
        const formattedResults = results.map(result => {
          return {
            category: {
              category_name: result.category_name,
              color_code: result.color_code
            },
            // todo의 다른 필드 추가
            todo_no: result.id,
            todo_name: result.todo_name
          };
        });
        res.status(200).json(formattedResults);
      }
    });
});
module.exports = router;