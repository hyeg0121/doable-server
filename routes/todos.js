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

      // users_todos 테이블에 insert
      db.query('INSERT INTO users_todos (user_id, todo_id) VALUES (?, ?)', [userId, todoId], (err, result) => {
        if (err) {
          console.error('Users_Todos 생성 에러:', err);
          res.status(500).json({ message: 'Todo 생성 실패' });
        } else {
          console.log('Todo 생성 성공');
          res.status(201).json({ message: 'Todo 생성 성공', todoId });
        }
      });
    }
  });
});

module.exports = router;