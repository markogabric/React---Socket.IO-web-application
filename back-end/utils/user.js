const users = [];
const colors = [
    "#00b75b",
    "#319a24",
    "#43b581",
    "#00d6d0",
    "#1e90ff",
    "#5f9ea0",
    "#ff7f50",
    "#daa520",
    "#d2691e",
    "#ff4500",
    "#ff4d4d",
    "#db4a3f",
];

function addUser(userId, username) {
    const usernameInUse = getUser(username);
    if (usernameInUse) {
        return undefined;
    }

    const user = {
        userId,
        username,
        chatroomId: "",
        points: {},
        color: colors[Math.floor(Math.random() * colors.length)],
    };

    users.push(user);
    return user;
}

function removeUser(userId) {
    const index = getUserIndexById(userId);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function userJoinRoom(chatroomId, username) {
    const index = getUserIndex(username);
    if (index !== -1) {
        users[index].chatroomId = chatroomId;

        if (!users[index].points[chatroomId]) {
            users[index].points[chatroomId] = 0;
        }
    }
}

function userLeaveRoom(username) {
    const index = getUserIndex(username);
    if (index !== -1) {
        users[index].chatroomId = "";
    }
}

function addPoints(chatroomId, username) {
    const index = getUserIndex(username);
    if (index !== -1) {
        users[index].points[chatroomId]++;
    }
}

function getUser(username) {
    const index = getUserIndex(username);
    if (index == -1) {
        return undefined;
    }
    return users[index];
}

function getUserIndex(username) {
    return users.findIndex((user) => user.username === username);
}

function getUserIndexById(id) {
    return users.findIndex((user) => user.userId === id);
}

function getUserList() {
    return users;
}

module.exports = {
    addUser,
    removeUser,
    userJoinRoom,
    userLeaveRoom,
    addPoints,
    getUser,
    getUserList,
};
