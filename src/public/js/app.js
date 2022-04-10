const socket = io();

const welcome = document.querySelector('#welcome');
const form = document.querySelector('form');
const room = document.querySelector('#room');

room.hidden = true;

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = document.querySelector('h3');
    h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = document.querySelector('input');
    socket.emit('enter_room', 
        input.value,
        showRoom
    )
    roomName = input.value;
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit)

// const messageList = document.querySelector('ul');
// const nickForm = document.querySelector('#nick');
// const messageForm = document.querySelector('#message');

// const webSocket = new WebSocket(`ws://${window.location.host}`);

// function makeMessage(type, payload) {
//     const msg = {type, payload};
//     return JSON.stringify(msg)
// }

// webSocket.addEventListener('open', () => {
//     console.log('connected to server')
// })

// webSocket.addEventListener('message', (message) => {
//     const li = document.createElement('li');
//     li.innerText = message.data;
//     messageList.append(li);
// })

// webSocket.addEventListener('close', () => {
//     console.log('disconnected from server')
// })

// // setTimeout(()=>{
// //     webSocket.send('hello from the browser')
// // }, 10000)

// const handleSubmit = (event) => {
//     event.preventDefault();
//     const input = messageForm.querySelector('input');
//     webSocket.send(makeMessage('new_message',input.value));
//     const li = document.createElement('li');
//     li.innerText = `You: ${message.data}`;
//     messageList.append(li);
//     input.value = ''
// }

// const handleNickSubmit = (event) => {
//     event.preventDefault();
//     const input = nickForm.querySelector('input');
//     webSocket.send(makeMessage('nickname', input.value));
//     input.value = ''
// }

// messageForm.addEventListener('submit', handleSubmit)
// nickForm.addEventListener('submit', handleNickSubmit)