//Requiring needed library
const net = require('net');
const readline = require('readline');

// Creating input using readline (to handle input data from user).
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const client = new net.Socket();
client.setEncoding('utf-8');

const waitMessage = new Promise(resolve => {
    rl.question('Digite /ENTRAR IP:PORTA APELIDO para se conectar: ', (input) => {
        resolve(input);
    });
});

waitMessage.then(message => {
    if((message.toUpperCase()).startsWith('/ENTRAR')){
        const [, addrport, username] = message.split(' ');
        const [address, port] = (addrport.replace(':', ' ')).split(' ');
        client.connect(Number(port), address, () => {
            client.write('/ENTRAR ' + username);
        });
        client.on('data', (data) => {
            console.log(data);
        });
        rl.on('line', data => {
            if(data.toUpperCase() === '/SAIR'){
                client.write('/SAIR');
                client.setTimeout(1000);
            }
            else if(data.toUpperCase() === '/USUARIOS'){
                client.write('/USUARIOS');
            }
            else if(data.toUpperCase() === '/NICK'){
                rl.question('Digite seu novo nickname: ', data => {
                    client.write(`/NICK ${data}`);
                });
            }
            else{
                client.write(data);
            }
        });
        client.on('timeout', () => {
            client.end();
        });
        client.on('end', () => {
            process.exit();
        });
    }
    else{
        //Terminate client.js
        process.exit();
    }
});
client.on('error', (err) => {
    console.error('Erro na conexão:' , err.message);
    process.exit();
});