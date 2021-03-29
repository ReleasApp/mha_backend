// module.exports = (io, socket) => {
//     const Chat = require('../models/chat');
//     const User = require('../models/user');

//     let users = [];
  
//     // // SOCKET.IO ROUTES
//     io.on('connection', () => {
//       console.log('inside checklist socket route');
//     })
  
//     /***********************
//     *       GET MESSAGE LIST         
//     ***********************/
//    socket.on('get-previous-chats', (receiverId, senderId) => {
//     console.log(receiverId, senderId);
//     socket.emit('message-list', 'Made it')    
//    })
// }