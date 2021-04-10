let users = [];

module.exports = (io, socket) => {
    const Chat = require('../models/chat')

    /**
     *  ON CONNECT
     */
    socket.on('join', data => {
        const index = users.findIndex(el => el.userId === data.senderId);
        const found = users.some(el => el.userId === data.senderId);
        if (!found) return users.push({userId: data.senderId, socketId: socket.id});
        if(found) return users[index].socketId = socket.id;
    });

    /**
     * ON DISCONNECT
     */ 
    socket.on('disconnect', () => {
        for(let i = 0; i < users.length; i++ ){
          if(users[i].socketId === socket.id){
            // socket.broadcast.emit('offline', {status: 'offline', user: users[i].userId});
            users.splice(i, 1);
          }
        }
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
    socket.on('new_message', (data) => {
        // console.log(users);
        Chat.create(data);
        // console.log(data);
        const index = users.findIndex(el => el.userId === data.user.receiverId);
        const found = users.some(el => el.userId === data.user.receiverId);
        if(found) socket.to(users[index].socketId).emit('private-message', data);      
    });
}
