from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sua_chave_secreta_aqui'
socketio = SocketIO(app, cors_allowed_origins="*")

# Contador de conexões
connected_users = 0

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    global connected_users
    if connected_users >= 2:
        emit('connection_refused', {'message': 'O chat está cheio.'})
        return False  # Recusa a conexão
    connected_users += 1
    print('Usuário conectado. Total:', connected_users)

@socketio.on('disconnect')
def handle_disconnect():
    global connected_users
    connected_users -= 1
    print('Usuário desconectado. Total:', connected_users)

@socketio.on('message')
def handleMessage(msg):
    print('Mensagem recebida:', msg)
    emit('message', msg, broadcast=True)  # Envia a mensagem para todos os clientes

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=10000)