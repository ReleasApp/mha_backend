const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
// const routes = require('./src/routes/blog');
// const chat_routes = require('./src/routes/chat');
const jwt = require('jsonwebtoken');
const { handleMessage } = require('./src/models/handler');
require('dotenv').config();

const app = express();
const http = require("http").createServer(app);
const  io = socket(http);

const port = process.env.PORT || 5050;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}, (err)=>{
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to mhadb successfully');
        http.listen(port, ()=> console.log(`Server listening on port ${port}`));
    }
})


// body parser set up
app.use(express.urlencoded({ extended: false,  limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// JWT setup
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY , (err, decode) => {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});


app.use(`/`, require('./src/routes/blog'));
// routes(app);

const users = {};

function createUsersOnline() {
  const values = Object.values(users);
  const onlyWithNames = values.filter(user => user.name !== undefined);
  return onlyWithNames; 
}

const chatSocket = io.of('/chatsocket');

chatSocket.on("connection", socket => {
  console.log("A user connected!");
  console.log(socket.id);
  socket.on("join", user => {
    users[socket.id].id = user._id;
    users[socket.id].name = user.name;
    handleMessage(socket, users);
  })
  // handleMessage(socket);

  // socket.on("message", message => {
  //   console.log(message);
  //   socket.emit("message", message);
  // });

  // Disconnect socket
  socket.on("disconnect", () => {
    delete users[socket.id];
    chatSocket.emit("action", { type: 'users_online', data: createUsersOnline() })
  })

  socket.on("action", action => {
    switch (action.type) {
      case "server/hello":
        console.log("Got hello event", action.data);
        socket.emit("action", { type: "message", data: "Good day!" });
        break;
      
      case "server/join":
        console.log("Got join event", action.data);
        chatSocket.emit("action", {
          type: "users_online",
          data: createUsersOnline()
        })
        break;
      
      case "server/private-message":
        console.log("Got a private-message", action.data);
      }
  })
});

