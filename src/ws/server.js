import { WebSocket, WebSocketServer } from "ws";

function sendJson(socket, payload){
    if(socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload){
    for(const clients of wss.clients){
        if(clients.readyState !== WebSocket.OPEN) return;
        clients.send(JSON.stringify(payload));
    }
}

export function attachWebSocketServer(server){ // we will use the same server to handle the rest apis as well as websocket requests 
    const wss = new WebSocketServer({server, path:'/ws', maxPayload:1024*1024});

    wss.on('connection', (socket) => {
        sendJson(socket, { type: 'welcome' });
        socket.on('error', console.error);
    });

    function broadcastMatchCreated(match){
        broadcast(wss, { type: 'match_created', data: match });
    }

    return { broadcastMatchCreated};
}
