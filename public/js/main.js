const socket = io();
const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chatForm");

const { username, room }= Qs.parse(location.search, {
   ignoreQueryPrefix: true 
});

document.getElementById("room-name").innerText = room;

socket.emit("userJoined", { username, room });
socket.on("mensajeServer", (msg) => outputMessage(msg, true));
socket.on("message", (msg) => outputMessage(msg, false));
socket.on("updateRoom", users => displayUsersInRoom(users));

chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const msg = chatForm.elements.msg.value;
    
    socket.emit("newMessage", { username, room, text: msg });
    
    chatForm.elements.msg.value = "";
    chatForm.elements.msg.focus();
});

function outputMessage(txt, serverMessage){
    const div = document.createElement("div");
    div.classList.add("message");
    if(serverMessage) div.classList.add("fromServer");
    div.innerHTML = `<p class='meta'>${txt.username} <span>${txt.time}</span></p>
        <p class='message'>${txt.text}</p>`;
    chatMessages.appendChild(div);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displayUsersInRoom(users){
    const userList = document.getElementById("users");
    userList.innerHTML = 
            `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}