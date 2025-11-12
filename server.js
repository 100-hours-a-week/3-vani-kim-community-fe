const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Routes

// Auth Routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'features', 'auth', 'pages', 'login', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'features', 'auth', 'pages', 'signup', 'signup.html'));
});

// Post Routes
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'features', 'posts', 'pages', 'create', 'create-post.html'));
});

app.get('/post/:postId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'features', 'posts', 'pages', 'detail', 'post.html'));
});

app.get('/post/:postId/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'features', 'posts', 'pages', 'edit', 'update-post.html'));
});

// User Routes
app.get('/user/me', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'features', 'user', 'pages', 'profile', 'user.html'));
});

app.get('/user/me/password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'features', 'user', 'pages', 'settings', 'update-password.html'));
});

app.get('/user/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'features', 'user', 'pages', 'profile', 'user.html'));
});

// Static middleware - must come after route definitions
app.use(express.static(path.join(__dirname, 'public')));

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});