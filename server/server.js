
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

    //For greeting individual user
    socket.emit('newMessage',{
        from:'Admin',
        text:'Welcome to the chat app',
        createdAt: new Date().getTime()
    });

    //Emit to everyone except who joined
    socket.broadcast.emit('newMessage',{
        from:'Admin',
        text:'New user joined!!',
        createdAt: new Date().getTime()
    })

  
socket.on('createMessage',function(message)
{
     console.log('createMessage',message);
     //User send a msg and server send it very user by io.emit

     io.emit('newMessage',{
         from: message.from,
         text: message.text,
         createdAt: new Date().getTime()
     });

    //if we want to send msg everyone except ourself we hve to use below syntax
    // socket.broadcast.emit('newMessage',{
    //     from: message.from,
    //      text: message.text,
    //      createdAt: new Date().getTime()
    // })
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
