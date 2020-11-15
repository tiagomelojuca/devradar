import socketio from 'socket.io-client';

const socket = socketio('http://localhost:3333/', {
    autoConnect: false,
    transports: ['websocket']   // Search about why this is needed now in changelogs, from socket.io-client 2.3.0 to 3.0.1 and expo SDK 36.0.0 to 39.0.4
});

function connect(obj) {
    socket.io.opts.query = obj;
    socket.connect();
}

function disconnect() {
    if ( socket.connected ) {
        socket.disconnect();
    }
}

function listenToNewDevs(updateDevsState) {
    socket.on('newdev', updateDevsState)
}

export {
    connect,
    disconnect,
    listenToNewDevs
};