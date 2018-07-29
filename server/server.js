
const express = require('express');
const http    = require('http');
const path = require('path');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));


io.on('connection', (socket) =>
{
    console.log("New user connected");

    //For greeting individual user
    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app'));

    //Emit to everyone except who joined
    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined!!'))

    socket.on('join',(params,callback) =>
{
    if(!isRealString(params.name) || !isRealString(params.room))
    {
        callback("Valid name and valid room name are required!!");
    }
    callback();
})

  
socket.on('createMessage',function(message,callback)
{
     console.log('createMessage',message);
     //User send a msg and server send it very user by io.emit

     io.emit('newMessage',generateMessage(message.from, message.text));
     callback();
});

socket.on('createLocationMessage',(coords) =>
{
    io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
})


    socket.on('disconnect', () =>
{
    console.log("user got disconnected")
});
});

server.listen(port,() =>
{
    console.log("Server started ...")
})
