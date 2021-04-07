const mongoose = require('mongoose');

module.exports = (io, socket) => {
    const Chat = require('../models/chat');

    let user =  {};

    /**
     *  ON CONNECT
     */
    socket.on('has-connected', (data) => {
        socket.id = data.senderId;
        user['senderId'] = socket.id;
        console.log(socket.id)
    })

    /**
     * GET PREVIOUS MESSAGES 
     */
    socket.on('get-previous-messages', async (data) => {
        try {
            const receiverOrSender = await Chat.find({
                $or: [
                    {
                        $and: [
                            {"user._id": user['senderId']}, 
                            {"user.receiverId": data.receiverId } 
                        ]
                    },
                    {
                        $and: [
                            {"user._id": data.receiverId}, 
                            {"user.receiverId": user['senderId'] } 
                        ]
                    }
                ]
            });
            // console.log({receiverOrSender});
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
            await Chat.create(data);
            await socket.to(data.receiverId).emit(data);
            console.log(data);
        } catch(err){
            console.log(err);
        }
    })
}
