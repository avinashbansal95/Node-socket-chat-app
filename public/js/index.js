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
var li = jQuery('<li></li>');
li.text(`${message.from} : ${message.text}`);
jQuery('#messages').append(li);
})

// socket.emit('createMessage',{
//     from:'avinashbansal',
//     text:'What is going on'
// },function(data)
// {
//     console.log(data,':Got it')
// });

jQuery('#message-form').on('submit',function(e)
{
  e.preventDefault();
  socket.emit('createMessage',{
    from:'avinashbansal',
    text:jQuery('[name=message]').val()
},function()
{

});

});