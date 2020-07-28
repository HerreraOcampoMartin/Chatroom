/* global __dirname */
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { getCurrentById, getUsersInRoom, addUser, userLeave } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//VARIABLES
app.use(express.static(path.join(__dirname, 'public')));
app.set("PORT", process.env.PORT || 3000);
const SERVER_NAME = "Server";

//SOCKETS
io.on("connection", socket => {
    socket.on("userJoined", data => {
        addUser(data.username, data.room, socket.id);
        const user = getCurrentById(socket.id);
        socket.join(user.room);
        
        socket.emit("mensajeServer", formatMessage(SERVER_NAME, "Bienvenido al chat"));

        socket.broadcast.to(user.room).emit("mensajeServer", formatMessage(SERVER_NAME, `${user.username} se unió.`));

        io.to(user.room).emit("updateRoom", getUsersInRoom(user.room));
    
        //MESSAGES
        socket.on("newMessage", (msg) => {
            io.to(user.room).emit("message", formatMessage(msg.username, msg.text));
        });

        socket.on("disconnect", () => {
            io.to(user.room).emit("mensajeServer", formatMessage(SERVER_NAME, `${user.username} se fue.`));
        });
    });
   
});

//SERVER LISTEN
server.listen(app.get("PORT"), () => console.log("Server live"));