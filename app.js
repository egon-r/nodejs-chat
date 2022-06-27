var app = require("express")()
var http = require("http").createServer(app)
var io = require("socket.io")(http)

var connectedClients = new Set();

app.get("/", function(req, res){
  res.sendFile(__dirname + "/views/index.html")
})

io.on("connection", function(socket){
  socket.on("chat message", function(msg){
    console.log(msg)
    if(socket.client.username != null && socket.client.username != "")
    {
      if(msg == "!users")
      {
        socket.emit("chat message", "Connected Users:");
        for (let client of connectedClients) {      
          socket.emit("chat message", client);
        }
      }else{
        io.emit("chat message", socket.client.username + ": " + msg);
      }
    }else{
      io.emit("chat message", "no username assigned to your client, please reload")
    }
  })

  socket.on("username", function(username)
  {
    if(connectedClients.has(username))
    {
      socket.emit("username invalid");
    }else{
      console.log("username: " + username);
      socket.client.username = username;
      io.emit("user connected", username)
      connectedClients.add(socket.client.username);
    }
  })

  socket.on("disconnect", function(){
    connectedClients.delete(socket.client.username);
  })
})

http.listen(3000, function(){
  console.log("App listening on port 3000!")
})