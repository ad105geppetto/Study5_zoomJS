import express from "express";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import http from "http"

const app = express();


app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'))
app.get('/', (req, res) => res.render('home'))
const handleListen = () => console.log(`Listening on http://localhost:3000`);
const httpServer = http.createServer(app);
const wsServerio = SocketIO(httpServer);

function publicRooms() {
    const {sockets: {adapter: {sids, rooms}}} = wsServerio;
    // 위의 코드는 아래의 코드와 동등하다.
    // const sids = wsServerio.sockets.adapter.sids;
    // const rooms = wsServerio.sockets.adapter.rooms;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

function countRoom(roomName){
    return wsServerio.sockets.adapter.rooms.get(roomName)?.size;
}

wsServerio.on('connection', socket => {
    socket['nickname'] = 'Anon';
    socket.onAny((event) => {
        console.log(`socket Event: ${event}`)
    })
    socket.on('enter_room', (roomName, done) => {
        socket.join(roomName)
        done();
        socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName))
        wsServerio.sockets.emit('room_change', publicRooms())
    })
    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1))
    })
    socket.on('disconnect', () => {
        wsServerio.sockets.emit('room_change', publicRooms())
    })
    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
        done()
    })
    socket.on('nickname', nickname => socket['nickname'] = nickname)
})

httpServer.listen(3000, handleListen);

// const server = http.createServer(app); // express app에서부터 http서버를 만든다.
// const wss = new WebSocket.Server({server})  // http서버를 wss서버로 

// const handleConnection = (soket) => {
//     console.log(soket)
//     // 이때의 소켓은 브라우저와 서버의 연결을 의미
// }

// const sockets = [];

// wss.on("connection", (socket)=> {
//     sockets.push(socket);
//     socket['nickname'] = 'Anon'
//     console.log('connected to broswer');
//     socket.on('close', () => console.log('disconnected from browser'))
//     socket.on('message', msg => {
//         const message = JSON.parse(msg);
//         switch(message.type){
//             case "new_message":
//                 sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
//                 break;
//             case "nickname":
//                 socket.nickname = message.payload;
//                 break;
//         }
//     })
// })
// 위의 경우 http와 wss를 합친 상태다.
// 물론 위의 경우처럼 같은 서버에서 http와 wss 둘다 작동시킬 수도 있지만
// 둘 중 하나만 사용해도 된다.
// server.listen(3000, handleListen); // app에서 리슨을 하지 않고 http server에서 리슨을 한다. 그리고 wss를 그 위에 만든 상태가 된다.
// 따라서 localhost는 동일한 포트에서 http, wss request 두 개를 처리할 수 있다.
// 현재 http서버와 wss를 함께 만든 이유는 
// view, static files, home, redirection을 사용해야 하기 때문임.