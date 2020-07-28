const users = [];

function getCurrentById(id){
    return users.find(user => user.id === id);
}

function addUser(username, room, id){
    const newUser = {
        username, room, id
    }
    users.push(newUser);
}

function getUsersInRoom(room){
    const usersInRoom = users.filter(user => user.room === room);
    return usersInRoom;
}

function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1)
        return users.splice(index, 1);
}

module.exports = {getCurrentById, getUsersInRoom, addUser, userLeave};