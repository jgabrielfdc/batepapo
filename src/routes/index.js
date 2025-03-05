const express = require('express');
const router = express.Router();

// Rota de exemplo
router.get('/welcome', (req, res) => {
    res.send('Bem-vindo ao Chat em Tempo Real!');
});

// Outras rotas podem ser adicionadas aqui

module.exports = router;