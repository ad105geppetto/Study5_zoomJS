const webSocket = new WebSocket(`ws://${window.location.host}`);

webSocket.addEventListener('open', () => {
    console.log('connected to server')
})

webSocket.addEventListener('message', (message) => {
    console.log('New message: ', message.data)
})

webSocket.addEventListener('close', () => {
    console.log('disconnected from server')
})

setTimeout(()=>{
    webSocket.send('hello from the browser')
}, 10000)