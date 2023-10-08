# Chat TCP em Node.js

Este é um exemplo de aplicação de chat TCP simples implementado em Node.js, consistindo de um servidor e um cliente que permitem que múltiplos usuários conversem entre si em uma rede.

Implementado como parte do trabalho de Sockets da disciplina de  Sistemas Distruibuídos 2023.2 (UFC/CE)

## Servidor

### Descrição

O servidor é responsável por lidar com conexões de entrada de clientes e facilitar a comunicação entre eles. Ele pode lidar com até um número máximo de quatro clientes simultâneos.

### Uso
Para utilizar a aplicação é necessário primeiramente iniciar o servidor em um terminal, para tal é necessário que a máquina possua o Node.js instalado.
```
node server.js
```
Após isso, em um outro terminal, podemos iniciaremos um cliente:
```
node client.js
Digite /ENTRAR IP:PORTA nomedeusuário para conectar: 
```
Como podemos ver acima, ao iniciarmos o cliente será solicitado que o usuário digite /ENTRAR o ip da máquina que esteja executando o servidor, juntamente da porta e um nome de usuário. Por padrão a porta utilizada será a 3333, caso o servidor esteja sendo executada na mesma máquina que a do cliente deveremos colocar como IP, localhost ou 127.0.0.1. Sendo assim para entrarmos nos servidor devemos colocar:
```
node client.js
Digite /ENTRAR IP:PORTA nomedeusuário para conectar: 
/ENTRAR 127.0.0.1:3333 solid
```
Ou como anteriormente sugerido:
```
node client.js
Digite /ENTRAR IP:PORTA nomedeusuário para conectar: 
/ENTRAR localhost:3333 solid
```
Lembrando que, caso o servidor esteja sendo executado em outra máquina, é necessário que o IP corresponda à mesma.

Por fim, caso a entrada seja bem sucedida, você receberá uma tela com a seguinte saída:
```
Digite /ENTRAR IP:PORTA nomedeusuário para conectar: /ENTRAR 127.0.0.1:3333 santos
Bem vindo ao Chat TCP, solid!
>
```
#### Comandos que o usuário pode realizar
##### /USUARIOS
Este comando permite que o cliente veja os usuários que estão presentes no chat. Caso haja pelo menos um usuário além do próprio cliente, ao digitar o comando será obtido uma saída conforme abaixo:
```
/USUARIOS
solid está online.
```
Caso ninguém além do próprio cliente esteja online a saída será assim:
```
/USUARIOS
Ninguém está online.
```

##### /NICK
Permite que o cliente altere o nome do seu usuário, caso o mesmo não esteja sendo utilizado. Para tal é necessário que seja digitado o comando juntamente do nome de usuário escolhido, se não houver nenhum conflito com algum nome já existente a saída será conforme mostrado abaixo:
```
/NICK liquid
Nome de usuário alterado com sucesso!
```
##### /SAIR
Garante que o cliente possa deixar o chat, removendo-o da lista de clientes e encerrando o processo do Client.js.
```
/SAIR
```
Ao sair os demais clientes são notificados a respeito do usuário que deixou o chat.
```
solid saiu do chat.
```