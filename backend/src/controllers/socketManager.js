import { connect } from "node:http2";
import { Server } from "socket.io";

// const connectToSocket = (server) => {
//   const io = new Server(server, {
//     connectionStateRecovery: {},
//     //    attach Socket.IO to HTTP server{  creates a WebSocket server. }
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//       allowedHeaders: ["*"],
//       credentials: true,
//     },
//   });

//   // 🔹 Listen for new socket connections
//   io.on("connection", (socket) => {
//     //runs whenever a user connects.
//     console.log("a user connected");

//     socket.onAny((eventName, ...args) => {
//       console.log(eventName, args);
//     });

//     socket.on("chat message", (msg) => {
//       // 🔹 send that message to everyone (including the sender)
//       io.emit("chat message", msg); //socket.broadcast.emit('hi'); to exclude client
//       //sends the message to every connected socket, including the sender.
//     });

//     socket.onAnyOutgoing((eventName, ...args) => {
//       console.log("Sent:", eventName, args);
//     });

//     // 🔹 Detect when a user disconnects
//     socket.on("disconnect", (reason) => {
//       console.log(`User ${socket.id} disconnected: ${reason}`);
//     });
//   });

//   // adding a event  listener for a "chat-message" events
// };

let connections = {}                                 //→ → This is an array of socket IDs currently in the same room (for example:
let messages = {}                                     //→ This stores an array of previous chat messages for the same room, like:                     
let timeOnline = {}                                       //when a user joined (for calculating session time)
const  connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        console.log("SOMETHING CONNECTED")

        socket.on("join-call", (path) => {                          //Here, path represents the room ID or meeting link.

            if (connections[path] === undefined) {
                connections[path] = []
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            // connections[path].forEach(elem => {
            //     io.to(elem)
            // })

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
            }

            // abhi tak “A new user with ID socket.id joined, and here’s the full updated list of users.”


            // Send existing chat history to the newly joined user

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        })


        // This part handles WebRTC signali ng — the messages needed to set up a peer-to-peer (P2P) video/audio connection.

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        //Server acts as a relay for signaling messages between clients (A ↔ B), so that they can establish a direct P2P connection for video/audio.


        // This code handles text chat messages — figuring out which room the sender belongs to, saving the message, and broadcasting it to everyone else in that room.
        // Let’s go piece by piece 👇

        
        socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections) //Object.entries(connections) deta hai array: // [
                                                                                                      //  ["roomA", ["sock1", "sock2"]],
                                                                                                      //  ["roomB", ["sock3"]]
                                                                                                      // ]
                    .reduce(([room, isFound], [roomKey, roomValue]) => {

                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                console.log("message", matchingRoom, ":", sender, data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }

        })

        socket.on("disconnect", () => {

            var diffTime = Math.abs(timeOnline[socket.id] - new Date())

            var key

            // Find which room this user belongs to

            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {   // k = room name (e.g., "roomA")  //v = socket IDs ka array (e.g., ["sock1", "sock2"])

                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k

                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit('user-left', socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        connections[key].splice(index, 1)

                        if (connections[key].length === 0) {                    //If room empty, delete it
                            delete connections[key]
                        }
                    }
                }

            }

        })

    })

    return io;
}

export { connectToSocket };
