const net = require('net');
const PORT = 3333;
const MAX_CLIENTS = 4;

const clients = [];

// BROADCAST FUNCTION - to handle messages from the socket
function broadcast(message, sender) {
    if(message.startsWith('/ENTRAR')){
        const [, username] = message.split(' ');
        clients.forEach(socket => {
            if (socket !== sender) socket.write(`${username} entrou no chat.`);
        });
    }else if (message.startsWith('/SAIR')) {
        const index = clients.indexOf(sender);
        clients.splice(index, 1);
        clients.forEach(socket => {
            if (socket !== sender) socket.write(`${sender.nickname} saiu no chat.`);
        });
    } else if(message === '/USUARIOS'){
        clients.forEach(socket => {
            if (socket !== sender) sender.write(`${socket.nickname} está online.`);
        });
    } else {
        clients.forEach(socket => {
            if (socket !== sender) socket.write(`${sender.nickname}: ${message}`);
        });
    }
}

// Function responsable for change nicknames from online
function changeNickname(username, socket){
    if((clients.some)((client) => client.nickname === username)){
        socket.write('O apelido ja está em uso. Escolha outro apelido\n');
        //socket.end();
    }
    else {
        const index = clients.indexOf(socket);
        const oldNickname = socket.nickname;
        socket.nickname = username;
        clients.splice(index, 1, socket);
        socket.write('Nome de usuário alterado com sucesso!');
        clients.forEach(client => {
            if (client !== socket) client.write(`${oldNickname} mudou seu nome de usuário para ${socket.nickname}`);
        })
    }
}

const server = net.createServer((socket) => {
    socket.setEncoding('utf-8');
    if(clients.length >= MAX_CLIENTS) {
        socket.write('O servidor atingiu o limite máximo de clientes');
        socket.end();
    } else{
        socket.on('data', (data) => {
            if (data.startsWith('/ENTRAR')){
                const [, username] = data.split(' ');
                if(clients.some((client) => client.nickname === username)) {
                    socket.write('O apelido ja está em uso. Operação cancelada\n');
                    socket.end();
                } else {
                    const nickname = username;
                    socket.nickname = nickname;
                    clients.push(socket);
                    socket.write(`Bem vindo ao Chat TCP, ${nickname}!`);
                    broadcast('/ENTRAR ' + `${nickname}`, socket);
                    socket.on('close', () => {
                        broadcast(`/SAIR`, socket);
                    });
                }
            }
            else if (data === '/SAIR'){
                broadcast('/SAIR', socket);
            }
            else if (data === '/NICK'){
                const [, username] = data.split(' ');
                console.log(username);
                changeNickname(username, socket);
            }
            else if (data === '/USUARIOS'){
                broadcast(data, socket);
            }
            else{
                broadcast(data, socket);
            }
            
        });
    }    
});

server.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});