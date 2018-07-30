
const express = require('express');
const http    = require('http');
const path = require('path');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname,'../public');
const {Users} = require('./utils/users')
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));


io.on('connection', (socket) =>
{
    console.log("New user connected");

    

    socket.on('join',(params,callback) =>
{
    if(!isRealString(params.name) || !isRealString(params.room))
    {
        return callback("Valid name and valid room name are required!!");
    }
    params.room = params.room.toLowerCase();
    socket.join(params.room);
    //Checking if two user of same name exist in chat
    if( users.users.length > 0)
    {

        const check = users.users.filter((user) => user.name === params.name && user.room === params.room);
        if(check.length > 0)
        {
            return callback("User of this name already exist in chat room");
            
        }
    }
   
    
    
    users.removeUser(socket.id);
    
    users.addUser(socket.id, params.name, params.room)

   io.to(params.room).emit('updateUserList', users.getUserList(params.room))


    //io.emit->io.to('ded').emit
    //socket.broadcast.emit ->socket.broadcast.to('dede').emit

//For greeting individual user
socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app'));

//Emit to everyone who is in the same room
socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined!!`))


    callback();
})

  
socket.on('createMessage',function(message,callback)
{
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text))
    {
        io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
    }
     console.log('createMessage',message);
     //User send a msg and server send it very user by io.emit

    
     callback();
});

socket.on('createLocationMessage',(coords) =>
{
    var user = users.getUser(socket.id);
    if(user)
    {
        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
    }
   
})


    socket.on('disconnect', () =>
{
    var user = users.removeUser(socket.id);
    if(user)
    {
        io.to(user.room).emit('updateUserList',users.getUserList(user.room));
        io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left!!`))
    }
    console.log("user got disconnected")
});
});

server.listen(port,() =>
{
    console.log("Server started ...")
})
