let users =  [];

module.exports = (io, socket) => {
    const Chat = require('../models/chat')

    /**
     *  ON CONNECT
     */






    
    socket.on('has-connected', (data) => {
        users.push(socket.id);
        socket.broadcast.emit('my-id', socket.id);
        console.log(users);
    })

    /**
     * GET PREVIOUS MESSAGES 
     */
    socket.on('get-previous-messages', async (data) => {
        try {
            console.log('in get messages',data)
            const receiverOrSender = await Chat.find({
                $or: [
                    {
                        $and: [
                            {"user._id": data.senderId}, 
                            {"user.receiverId": data.receiverId } 
                        ]
                    },
                    {
                        $and: [
                            {"user._id": data.receiverId}, 
                            {"user.receiverId": data.senderId } 
                        ]
                    }
                ]
            });
            const result = receiverOrSender.reverse();
            socket.emit('get-previous-messages', result);
        } catch(err){
            console.log(err)
        } 
    })

    /**
     * NEW MESSAGE
     */
    socket.on('new_message', async (data) => {
        try {
            await socket.to(data.user.receiverId).emit('private-msg', data);
            await Chat.create(data);
            console.log(data);
        } catch(err){
            console.log(err);
        }
    })
}
