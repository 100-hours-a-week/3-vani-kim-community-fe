const express = require('express');
const path = require('path');

const app = express();
const port = 3000;


// 페이지 내놔!
//로그인
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
})
//회원가입
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
})
//목록 페이지
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','index.html'));
})
//유저 조회 TODO 구현 필요
app.get('/user/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','user.html'));
})
//개인정보
app.get('/user/me', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','user.html'));
})
//비밀번호 변경
app.get('/user/me/password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update-password.html'));
})

//게시글 상세 조회
app.get('/post/:postId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'post.html'));
})
//게시글 수정
app.get('/post/:postId/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update-post.html'));
})
//게시글 생성
app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create-post.html'));
})

//정적 미들웨어... 이게 먼저 나오면 뒤에가 처리가 안된다..
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});