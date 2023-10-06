const net = require('net');
const PORT = 3300;
const MAX_CLIENTS = 4;
let clients = [];


const server = net.createServer(socket => {
    if(clients.length < MAX_CLIENTS){
        clients.push(socket);
        console.log(clients.length);
        socket.on('data', data => {
            broadcast(data, socket);
        });
        socket.on('close', () => {
            console.log('A client has left the chat.');
        });
    }
    else{
        console.log('Connection refused');
        socket.end();
    } 
});

function broadcast(message, clientsent) {
    if (message === 'quit') {
        const index = clients.indexOf(clientsent);
        clients.splice(index, 1);
    } else {
        clients.forEach(socket => {
            if (socket !== clientsent) socket.write(message);
        });
    }
}


server.listen(PORT, () => {
	console.log(`Server listening at ${PORT}`);
});