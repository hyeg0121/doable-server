const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

app.use(cors({
  origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));

const connection = mysql.createConnection({
  host: 'localhost',  // MySQL 호스트 주소
  user: 'root', // MySQL 사용자 이름
  password: '1234567890',  // MySQL 비밀번호
  database: 'doable'  // 사용할 데이터베이스 이름
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류: ' + err.stack);
    return;
  }
  console.log('MySQL 연결 성공');
});


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// auth
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!userid || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // 사용자를 데이터베이스에서 조회
    const [results] = await connection.execute('SELECT * FROM users WHERE userid = ?', [username]);
    connection.end();

    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // 로그인 성공
      return res.json({ message: 'Login successful', user });
    } else {
      return res.status(401).json({ error: 'Invalid password.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
