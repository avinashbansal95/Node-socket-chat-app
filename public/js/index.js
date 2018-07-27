var socket = io();
socket.on('connect', function ()
{
console.log("Connected to server");
});

socket.on('disconnect', function () 
{
console.log("Disconnected from the server")
})

socket.on('newMessage', function (message) 
{
console.log('new Message',message);
})

socket.emit('createMessage',{
    from:'avinashbansal',
    text:'What is going on'
},function(data)
{
    console.log(data,':Got it')
});