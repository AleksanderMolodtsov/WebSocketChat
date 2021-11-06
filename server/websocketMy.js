const ws = require('ws');

const wss = new ws.Server({
    port: 5000,
}, () => {
    console.log('Server is on 5000 started!')
});

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message);
        switch(message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            case 'connection':
                broadcastMessage(message)
                break;
        }
    })
});

function broadcastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}

const message = {
    event: 'message/connection',
    id: 123,
    data: '06.11.2021',
    username: 'AlexTheMagnificent',
    message: 'My first message',
}