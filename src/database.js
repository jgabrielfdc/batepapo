const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Cria ou abre o banco de dados
const db = new sqlite3.Database(path.join(__dirname, 'chat.db'));

// Cria a tabela de usuários (se não existir)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
});

// Função para registrar um novo usuário
const registerUser = (username, password, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return callback(err);
        db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hash],
            callback
        );
    });
};

// Função para autenticar um usuário
const authenticateUser = (username, password, callback) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return callback(err);
        if (!user) return callback(new Error('Usuário não encontrado'));

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return callback(err);
            if (!result) return callback(new Error('Senha incorreta'));
            callback(null, user);
        });
    });
};

module.exports = { db, registerUser, authenticateUser };