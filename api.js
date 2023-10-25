const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors({
  origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',  // MySQL 호스트 주소
  user: 'root', // MySQL 사용자 이름
  password: '1234567890',  // MySQL 비밀번호
  database: 'doable'  // 사용할 데이터베이스 이름
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류: ' + err.stack);
    return;
  }
  console.log('MySQL 연결 성공');
});

// auth
app.post('/login', async (req, res) => {
  const { userid, password } = req.body;

  // MySQL 데이터베이스에서 사용자 정보 확인
  const query = 'SELECT * FROM users WHERE userid = ? AND password = ?';
  db.query(query, [userid, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // 유효한 사용자인 경우
      const user = results[0];
      res.json({ message: '로그인 성공' , user});
    } else {
      // 사용자 정보가 일치하지 않는 경우
      res.status(401).json({ error: '로그인 실패' });
    }
  });
});


// 회원가입 
app.post('/join', (req, res) => {
  const { name, userid, password, email } = req.body;

  // MySQL 데이터베이스에 새로운 사용자 추가
  const sql = 'INSERT INTO users (name, userid, password, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, userid, password, email], (err, result) => {
    if (err) {
      console.error('회원가입 오류:', err);
      res.status(500).json({ message: '회원가입 실패'});
    } else {
      console.log('회원가입 성공');
      res.status(201).json({ message: '회원가입 성공' ,
      user: req.body});
    }
  });
});

// user
app.get('/users/:id', (req, res) => {
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

//group 
app.post('/groups', (req, res) => {
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



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
