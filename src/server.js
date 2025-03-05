const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { db, registerUser, authenticateUser } = require('./database');
const setupChat = require('./sockets/chat');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware para processar JSON
app.use(express.json());

// Serve arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Rota para registro de usuários
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    registerUser(username, password, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
        res.json({ message: 'Usuário registrado com sucesso' });
    });
});

// Rota para login de usuários
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    authenticateUser(username, password, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        res.json({ message: 'Login bem-sucedido', user });
    });
});

// Rota para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Configura a lógica do chat
setupChat(io);

// Inicia o servidor
server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});