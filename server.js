const express = require('express');
const path = require('path');
const app = express();

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});

const socket = require('socket.io');
const io = socket(server);

let messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'))
});

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    console.log('I\'ve added a listener on message event \n'); 

    socket.on('join', (user) =>{
        console.log("Oh, I've got something from " + socket.id);
        users.push(user);
        socket.broadcast.emit('join', user)
    })

    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left');
        const index = users.findIndex(user => user.id === socket.id);
        const userRemove = users[index];
        users.splice(index, 1);
        socket.broadcast.emit('userRemove', userRemove);
    });
});

