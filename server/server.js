
const express = require('express');
const http    = require('http');
const path = require('path');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));


io.on('connection', (socket) =>
{
    console.log("New user connected");

    socket.emit('newMessage',{
        from:'avinash',
        text:'hey you got some new some msgs',
        createdAt: 123
    });
socket.on('createMessage',function(message)
{
     console.log('createMessage',message);
});

    socket.on('disconnect', () =>
{
    console.log("user got disconnected")
});
});

server.listen(port,() =>
{
    console.log("Server started ...")
})
