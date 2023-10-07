// Importing the 'net' module for server functionality
const net = require('net');

// Defining the port number (e.g., 3333)
const PORT = 3333;

// Setting the maximum number of clients allowed per server
const MAX_CLIENTS = 4;

// Creating an array named 'clients' to manage connected clients
let clients = [];

// BROADCAST FUNCTION - Handles messages from the socket
function broadcast(message, sender) {
    if (message.startsWith('/ENTRAR')) {
        // Notify all online users that there's a new user online
        const [, username] = message.split(' ');
        clients.forEach(clientSocket => {
            if (clientSocket !== sender) clientSocket.write(`${username} entrou no chat.`);
        });
    } else if (message.startsWith('/SAIR')) {
        // Remove the user from the Client's Array and send messages to all other users notifying that the sender left the server
        const index = clients.indexOf(sender);
        clients.splice(index, 1);
        clients.forEach(clientSocket => {
            if (clientSocket !== sender) clientSocket.write(`${sender.nickname} saiu do chat.`);
        });
    } else if (message === '/USUARIOS') {
        // Send a list of online users to the sender
        console.log(clients.length);
        if (clients.length - 1 > 0) {
            clients.forEach(clientSocket => {
                if (clientSocket !== sender) sender.write(`${clientSocket.nickname} está online.`);
            });
        } else {
            sender.write('Ninguém está online.');
        }
    } else {
        // Send the message to all other users
        clients.forEach(clientSocket => {
            if (clientSocket !== sender) clientSocket.write(`${sender.nickname}: ${message}`);
        });
    }
}

// CHANGE NICKNAME FUNCTION - Allows users to change their nicknames
function changeNickname(newUsername, socket) {
    // Check if the chosen username is already in use by another client
    if (clients.some(client => client.nickname === newUsername)) {
        socket.write('O nome de usuário já está em uso. Operação cancelada.');
    } else {
        const index = clients.indexOf(socket);
        const oldNickname = socket.nickname;
        socket.nickname = newUsername;
        clients.splice(index, 1, socket);
        socket.write('Nome de usuário alterado com sucesso!');
        // Notify other users about the nickname change
        clients.forEach(clientSocket => {
            if (clientSocket !== socket) clientSocket.write(`${oldNickname} mudou seu nome de usuário para ${socket.nickname}`);
        });
    }
}

// Create a TCP server using the 'net' module
const server = net.createServer(socket => {
    socket.setEncoding('utf-8');
    // Check if the number of online users exceeds the server's maximum capacity
    if (clients.length >= MAX_CLIENTS) {
        socket.write('O servidor atingiu o número máximo de usuários. Acesso Negado');
        socket.end();
    } else {
        socket.on('data', data => {
            if (data.startsWith('/ENTRAR')) {
                let [, username] = data.split(' ');
                if (username == 'undefined') {
                    username = `user` + (clients.length + 1).toString();
                }
                // Check if there's an existing user with the same username
                if (clients.some(client => client.nickname === username)) {
                    socket.write('O nome de usuário já está em uso. Operação cancelada.\n');
                    //socket.end();
                } else {
                    // Store the socket in the Client's Array
                    const nickname = username;
                    socket.nickname = nickname;
                    clients.push(socket);
                    socket.write(`Bem vindo ao Chat TCP, ${nickname}!`);
                    broadcast('/ENTRAR ' + `${nickname}`, socket);
                }
            } else if (data.startsWith('/NICK')) {
                // Receive a new username
                const [, newUsername] = data.split(' ');
                changeNickname(newUsername, socket);
            } else {
                // Broadcast a standard message
                broadcast(data, socket);
            }
        });
    }
    // Handle errors to prevent them from crashing the server
    socket.on('error', error => {
        if (error.code === 'ECONNRESET') {
            if(socket.nickname !== 'undefined'){
                //broadcast('/SAIR', socket);
            }
        } else {
            console.error('Socket Error:', error);
        }
    });
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log(`Servidor executando na porta ${PORT}`);
});
