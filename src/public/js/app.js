const socket = io();

const welcome = document.querySelector('#welcome');
const form = document.querySelector('form');
const room = document.querySelector('#room');

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li)
}


function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#msg input');
    const value = input.value;
    socket.emit('new_message', input.value, roomName, () => {
        addMessage(`You: ${value}`)
    });
    input.value = '';
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#name input');
    socket.emit('nickname', input.value)
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = document.querySelector('h3');
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector('#msg');
    const nameForm = room.querySelector('#name');
    msgForm.addEventListener('submit', handleMessageSubmit)
    nameForm.addEventListener('submit', handleNicknameSubmit)
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

socket.on('welcome', (user) => {
    addMessage(`${user} arrived!`)
})

socket.on('bye', (left) => {
    addMessage(`${left} left ㅜㅜ`)
})

socket.on('new_message', addMessage)

socket.on('room_change', (rooms) => {
    const roomList = welcome.querySelector('ul');
    roomList.innerHTML = '';
    if(rooms.length === 0){
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
    })
})

// socket.on('room_change', console.log)
// 위의 코드는 아래의 코드와 같다.
// socket.on('room_change', (msg) => console.log(msg))

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