const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

const socket = io();
//listener
socket.on('message', ({ author, content }) => addMessage(author, content));

socket.on('join', (user) =>
    addMessage('Chat Bot', `${user.name} has joined the conversation!`)
);

socket.on('userRemove', (user) =>
    addMessage('Chat Bot', `${user} has left the conversation... :(`)
);

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

function login(event){
    event.preventDefault();
    if (userNameInput.value === ''){
        return alert('Please add User Name!')
    } else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        socket.emit('join',{
            name: userName,
            id: socket.id
        });
    }
};

function sendMessage(event){
    event.preventDefault();
    if (messageContentInput === ''){
        return alert('Please add Message!')
    }else {
        addMessage(userName, messageContentInput.value);
        socket.emit('message', { 
            author: userName, 
            content: messageContentInput.value 
        });
        messageContentInput.value = '';
    }
};

function addMessage(author, content){
    const message = document.createElement('li');
    message.classList.add('message','message--received');
    author === userName ? message.classList.add('message--self') : '';
    author === 'Chat Bot' ? message.classList.add('message--chat-box') : '';
    message.innerHTML = `
        <h3 class="message__author">${userName === author ? 'You' : author}</h3>
        <div class="message__content">
            ${content}
        </div>`;
    messagesList.appendChild(message);
};

