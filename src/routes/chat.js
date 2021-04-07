module.exports = (io, socket) => {
    const Chat = require('../models/chat')

    /**
     *  ON CONNECT
     */
    // creating a room name that's unique using both user's unique username
    socket.on('join', roomName => {
        let split = roomName.split('--with--') //['senderId', 'receiverId']
        let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1)); //['senderId', 'receiverId']
        let updatedRoomName = `${unique[0]}--with--${unique[1]}`; // 'username1--with--username2'

        Array.from(socket.rooms)
            .filter(it => it !== socket.id)
            .forEach(id => {
                socket.leave(id);
                socket.removeAllListeners('emitMessage');
            });

        socket.join(updatedRoomName);

        socket.on('emitMessage', async (message) => {
            await Array.from(socket.rooms)
                .filter(it => it !== socket.id)
                .forEach(id => {
                    Chat.create(message);
                    socket.to(id).emit('onMessage', message)
            });
        });
    });

    socket.on('disconnect', ()=>{
        socket.removeAllListeners();
    })





    
    // socket.on('has-connected', (data) => {
    //     users.push(socket.id);
    //     socket.broadcast.emit('my-id', socket.id);
    //     console.log(users);
    // })

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
    // socket.on('new_message', async (data) => {
    //     try {
    //         await socket.to(data.user.receiverId).emit('private-msg', data);
    //         await Chat.create(data);
    //         console.log(data);
    //     } catch(err){
    //         console.log(err);
    //     }
    // })
}
