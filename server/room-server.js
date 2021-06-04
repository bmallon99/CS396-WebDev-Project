// const ws = require("ws");
'use strict';

const express = require('express');
const { Server } = require('ws');
const path = require('path');

const port = process.env.PORT || 8081;
// const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(path.resolve(__dirname, '../client/build')))
  .listen(port, () => console.log(`Listening on ${port}`));

// const port = process.env.PORT || 8081;
// const wss = new ws.Server({ port });
const wss = new Server({ server });
console.log("Application listening on PORT: " + port);

// Dictionary mapping room numbers to set of clients (sockets)
let rooms = {};
/*
    rooms: {
        roomCode1: [socket1, socket2, ...]
        roomCode2: [socket1, socket2, ...]
    }
*/

let names = {};
/*
    names: {
        roomCode1: [name1, name2, ...]
        roomCode2: [name1, name2, ...]
    }
*/

let votes = {};
/*
    votes: {
        roomCode1: {
            peopleVoted: num,
            suggestions: {
                suggestion1: numVotes,
                suggestion2: numVotes,
                ...
            }
        },
        roomCode2: {
            peopleVoted: num,
            suggestions: {
                suggestion1: numVotes,
                suggestion2: numVotes,
                ...
            }
        },
        ...
    }
*/


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

const calculateWinner = (roomCode) => {
    let max_sug = null;
    let max = 0;
    console.log(Object.entries(votes[roomCode]["suggestions"]));
    for (const [suggestion, v] of Object.entries(votes[roomCode]["suggestions"])) {
        if (v > max) {
            max = v;
            max_sug = suggestion;
        }
    }
    return max_sug;
}

const teardown = (roomCode) => {

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
            names[roomCode] = new Set([data.name]);
            votes[roomCode] = {};
            votes[roomCode]["peopleVoted"] = 0;
            votes[roomCode]["suggestions"] = {};
            const message = {
                "type": "create",
                "status": "okay",
                "members": Array.from(names[roomCode]),
                "roomCode": roomCode
            }
            sendJSON(message, socket);
            return;
        }
        else if (data.type === "join") {
            const roomCode = data.roomCode;
            if (roomCode in rooms) {
                rooms[roomCode].add(socket);
                names[roomCode].add(data.name);
                const message = {
                    "type": "join",
                    "status": "okay",
                    "roomCode": roomCode,
                    "members": Array.from(names[roomCode])
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
        } else if (data.type === "suggest") {
            console.log("good");
            const roomCode = data.roomCode;
            if (roomCode in rooms) {
                const suggestion = data.suggestion;
                let returnMessage;
                if (suggestion in votes[roomCode]["suggestions"]) {
                    returnMessage = {
                        "type": "suggest",
                        "status": "duplicate",
                        "suggestions": Object.keys(votes[roomCode]["suggestions"])
                    }
                } else {
                    votes[roomCode]["suggestions"][suggestion] = 0;
                    returnMessage = {
                        "type": "suggest",
                        "status": "okay",
                        "suggestions": Object.keys(votes[roomCode]["suggestions"])
                    }
                }
                
                rooms[roomCode].forEach(member => {
                    sendJSON(returnMessage, member);
                });
                return;
            } else {
                console.log("bad");
                const message = {
                    "type": "suggest",
                    "status": "bad",
                }      
                sendJSON(message, socket);      
            }
        } else if (data.type === "vote") {
            const roomCode = data.roomCode;
            if (roomCode in rooms) {
                const selectedSuggestions = data.selectedSuggestions;
                let returnMessage;
                for (const suggestion of selectedSuggestions) {
                    votes[roomCode]["suggestions"][suggestion]++;
                }
                votes[roomCode]["peopleVoted"]++;
                
                if (votes[roomCode]["peopleVoted"] >= rooms[roomCode].size) {
                    returnMessage = {
                        "type": "vote",
                        "done": true,
                        "status": "okay",
                        "roomCode": roomCode,
                        "numVoted": votes[roomCode]["peopleVoted"],
                        "winner": calculateWinner(roomCode)
                    };
                    rooms[roomCode].forEach(member => {
                        sendJSON(returnMessage, member);
                    });
                    teardown(roomCode);
                } else {
                    returnMessage = {
                        "type": "vote",
                        "done": false,
                        "status": "okay",
                        "roomCode": roomCode,
                        "numVoted": votes[roomCode]["peopleVoted"]
                    }
                    sendJSON(returnMessage, socket);      
                }
            } else {
                console.log("bad");
                const message = {
                    "type": "vote",
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
