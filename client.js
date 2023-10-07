// Import the required library
const net = require('net');
const readline = require('readline');

// Create input interface using readline (to handle user input data).
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Create a socket object named 'client'
const client = new net.Socket();

// Set encoding to UTF-8 to handle text
client.setEncoding('utf-8');

// Create a promise to await user response
const waitMessage = new Promise(resolve => {
    rl.question('Digite /ENTRAR IP:PORTA nomedeusuário para conectar: ', (input) => {
        resolve(input);
    });
});

// Executes after the promise is resolved
waitMessage.then(message => {
    // Check if the message starts with "/ENTRAR" (case-insensitive)
    if ((message.toUpperCase()).startsWith('/ENTRAR')) {
        const [, addrport, username] = message.split(' ');
        const [address, port] = (addrport.replace(':', ' ')).split(' ');
        // Connect to the server with the specified IP address and port
        client.connect(Number(port), address, () => {
            // Send "/ENTRAR" followed by the username to the server
            client.write('/ENTRAR ' + username);
        });
        // Set up a listener to receive data from the server and display it on the console
        client.on('data', (data) => {
            console.log(data);
        });
        // Set up a listener to handle lines received from the user in the console
        rl.on('line', data => {
            if (data.toUpperCase() === '/SAIR') {
                // Send "/SAIR" to the server and set a timeout of 1000ms
                client.write('/SAIR');
                client.setTimeout(1000);
            } else if (data.toUpperCase() === '/USUARIOS') {
                // Send "/USUARIOS" to the server
                client.write('/USUARIOS');
            } else if (data.toUpperCase() === '/NICK') {
                // Send "/NICK" followed by the username received by the user
                client.write(`/NICK ${data}`);
            } else {
                // Send the message received from the user to the server
                client.write(data);
            }
        });
        // Set up a listener to handle connection timeouts and end the client
        client.on('timeout', () => {
            client.end();
        });
        // Set up a listener to handle the end event and exit the process
        client.on('end', () => {
            process.exit();
        });
    } else {
        // Exit the 'client.js' process if the message does not start with "/ENTRAR"
        process.exit();
    }
    // Handle connection errors and display an error message before exiting the process
    client.on('error', (err) => {
        console.error('Erro de conexão:', err.message);
        // Exit the running process in the terminal
        process.exit();
    });
});
