module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Um usuário conectou:', socket.id);

        // Recebe mensagens e envia para o outro usuário
        socket.on('chat message', (msg) => {
            // Envia a mensagem com o ID do usuário
            io.emit('chat message', {
                user: socket.id, // Identificador do usuário
                message: msg    // Mensagem
            });
        });

        // Quando um usuário desconectar
        socket.on('disconnect', () => {
            console.log('Um usuário desconectou:', socket.id);
        });
    });
};