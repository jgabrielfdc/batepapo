$(document).ready(() => {
    const socket = io();
    let username = '';

    const $messages = $('#messages');
    const $form = $('#form');
    const $input = $('#input');

    // Função para exibir mensagens
    const displayMessage = (data) => {
        const messageClass = data.user === socket.id ? 'self' : 'other';
        const userLabel = data.user === socket.id ? 'Você' : data.username;
        const messageHtml = `
            <div class="message ${messageClass}">
                <span class="username">${userLabel}:</span> ${data.message}
                <span class="timestamp">${data.timestamp}</span>
            </div>
        `;
        $messages.append(messageHtml);
        $messages.scrollTop($messages[0].scrollHeight); // Rolagem automática
    };

    // Recebe o histórico de mensagens
    socket.on('chat history', (history) => {
        history.forEach((data) => {
            displayMessage(data);
        });
    });

    // Recebe novas mensagens
    socket.on('chat message', (data) => {
        displayMessage(data);
    });

    // Envia mensagens para o servidor
    $form.on('submit', (e) => {
        e.preventDefault();
        const message = $input.val();
        if (message) {
            socket.emit('chat message', { username, message });
            $input.val('');
        }
    });

    // Login do usuário
    $('#loginForm').on('submit', (e) => {
        e.preventDefault();
        const usernameInput = $('#username').val();
        const passwordInput = $('#password').val();

        $.post('/login', { username: usernameInput, password: passwordInput }, (response) => {
            if (response.message === 'Login bem-sucedido') {
                username = usernameInput;
                $('#loginModal').modal('hide');
                $('#chat').show();
            } else {
                alert('Credenciais inválidas');
            }
        }).fail(() => {
            alert('Erro ao fazer login');
        });
    });

    // Registro do usuário
    $('#registerForm').on('submit', (e) => {
        e.preventDefault();
        const usernameInput = $('#registerUsername').val();
        const passwordInput = $('#registerPassword').val();

        $.post('/register', { username: usernameInput, password: passwordInput }, (response) => {
            if (response.message === 'Usuário regist