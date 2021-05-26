const ws = require("ws");

const port = process.env.PORT || 8081;
const wss = new ws.Server({ port });
console.log("Application listening on PORT: " + port);

// Dictionary mapping room numbers to set of clients (sockets)
let rooms = {};

const totalRooms = 8999;
const smallestRoom = 1000;

const sendJSON = (json, client) => {
    console.log('sending the following JSON:', json);
    client.send(JSON.stringify(json));
};

const generateRoomCode = () => {
    let roomCode = Math.floor(Math.random() * totalRooms + smallestRoom);
    while (roomCode in rooms) {
        roomCode = Math.floor(Math.random() * totalRooms + smallestRoom);
    }
    return roomCode;
}

wss.on("connection", socket => {
    console.log("Client connected on PORT: " + port);
    
    socket.on("message", message => {
        const data = JSON.parse(message);
        console.log(data);
        // types: create, join, ....

        if (data.type === "create") {
            const roomCode = generateRoomCode();
            rooms[roomCode] = new Set([socket]);
            const message = {
                "type": "create",
                "status": "okay",
                "roomCode": roomCode
            }
            sendJSON(message, socket);
            return;
        }
        else if (data.type === "join") {
            const roomCode = data.roomCode;
            if (roomCode in rooms) {
                rooms[roomCode].add(socket);
                const message = {
                    "type": "join",
                    "status": "okay",
                    "members": rooms[roomCode].size
                }
                rooms[roomCode].forEach(member => {
                    sendJSON(message, member);
                });
                return;
            } else {
                const message = {
                    "type": "join",
                    "status": "bad",
                }      
                sendJSON(message, socket);      
            }
        }

        // this loop sends the message that was just received to all the connected clients:
        // wss.clients.forEach(client => {
        //     if (client.readyState === ws.OPEN) {
        //         let message = data;
        //         if (data.type === "login") {
        //             loggedInUsers.add(data.username);
        //             message = {
        //                 "type": "login",
        //                 "users": Array.from(loggedInUsers)
        //             }
        //         }
        //         else if (data.type === "disconnect") {
        //             loggedInUsers.delete(data.username);
        //             message = {
        //                 "type": "disconnect",
        //                 "users": Array.from(loggedInUsers)
        //             }
        //         } 
        //         // replace this line of code in order to implement 
        //         // the logic outlined above.
        //         console.log(message);
        //         sendJSON(message, client);
        //     }
        // });
    });
});