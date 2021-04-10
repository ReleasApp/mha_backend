const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const jwt = require('jsonwebtoken');
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
        process.on('warning', e => console.warn(e.stack));
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

// Sockets
const chatSocket = io.of('/chatsocket');
chatSocket.on("connection", async(socket) => {
//   console.log("New user connected with id " + socket.id);
  try {
      await require('./src/routes/chat')(io, socket);
    //   console.log('chatsocket', chatSocket);
  } catch(error){
      console.log(error);
  }
  
});


