const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const assert = require("chai").assert;

describe("mhaapp", () => {
    let io, serverSocket, clientSocket;
  
    before((done) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = new Client(`http://localhost:${port}`);
        io.on("connection", (socket) => {
            serverSocket = socket;
            // require('../routes/chat')(io, socket);
        });
        clientSocket.on("join", done());
      });
    });

    after(() => {
        io.close();
        clientSocket.close();
      });
    
      it("should connect", (done) => {
        clientSocket.on("get-previous-messages", (arg) => {
          assert.equal(arg, "return data");
          done();
        });
        serverSocket.emit("get-previous-messages", data);
      });
    
      it("Should send", (done) => {
        serverSocket.on("new_message", (cb) => {
          cb(data);
        });
        clientSocket.emit("private-message", (arg) => {
          assert.equal(arg);
          done();
        });
      });
    });