function createMessage(message) {
    return {
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: {
            _id: message.user._id,
            name: message.user.name,
            avatar: message.user.avatar
        }
    }
}

function handleMessage(socket, users) {
    socket.on("message", receivedMessage => {
        const message = createMessage(receivedMessage)
        console.log(message);
        console.log('/', users);
        socket.broadcast.emit("message", message);
    })
}

module.exports = { handleMessage };