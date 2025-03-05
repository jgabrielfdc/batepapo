document.addEventListener('DOMContentLoaded', function() {
    const socket = io.connect('https://' + document.domain + ':' + location.port);

    const messageInput = document.getElementById('myMessage');
    const sendButton = document.getElementById('sendButton');
    const messagesList = document.getElementById('messages');

    // Função para enviar mensagem
    function sendMessage() {
        const msg = messageInput.value.trim();
        if (msg) {
            socket.send(msg);  // Envia a mensagem para o servidor
            messageInput.value = '';  // Limpa o campo de entrada
        }
    }

    // Envia mensagem ao clicar no botão
    sendButton.addEventListener('click', sendMessage);

    // Envia mensagem ao pressionar Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Recebe mensagens do servidor
    socket.on('message', function(msg) {
        const li = document.createElement('li');
        li.textContent = msg;
        li.classList.add('my-message');  // Adiciona classe para mensagens enviadas
        messagesList.appendChild(li);
        // Rola para a última mensagem
        messagesList.scrollTop = messagesList.scrollHeight;
    });
});