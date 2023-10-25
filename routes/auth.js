const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/db');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// auth
router.post('/login', async (req, res) => {
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
router.post('/join', (req, res) => {
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

module.exports = router;