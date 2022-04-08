import express from "express";
import WebSocket from "ws";
import http from "http"

const app = express();


app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'))
app.get('/', (req, res) => res.render('home'))
const handleListen = () => console.log(`Listening on http://localhost:3000`);
const server = http.createServer(app); // express app에서부터 http서버를 만든다.
const wss = new WebSocket.Server({server})  // http서버를 wss서버로 

// const handleConnection = (soket) => {
//     console.log(soket)
//     // 이때의 소켓은 브라우저와 서버의 연결을 의미
// }

const sockets = [];

wss.on("connection", (socket)=> {
    sockets.push(socket);
    socket['nickname'] = 'Anon'
    console.log('connected to broswer');
    socket.on('close', () => console.log('disconnected from browser'))
    socket.on('message', msg => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
            case "nickname":
                socket.nickname = message.payload;
        }
    })
})
// 위의 경우 http와 wss를 합친 상태다.
// 물론 위의 경우처럼 같은 서버에서 http와 wss 둘다 작동시킬 수도 있지만
// 둘 중 하나만 사용해도 된다.
server.listen(3000, handleListen); // app에서 리슨을 하지 않고 http server에서 리슨을 한다. 그리고 wss를 그 위에 만든 상태가 된다.
// 따라서 localhost는 동일한 포트에서 http, wss request 두 개를 처리할 수 있다.
// 현재 http서버와 wss를 함께 만든 이유는 
// view, static files, home, redirection을 사용해야 하기 때문임.