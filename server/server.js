import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'

const app=express();
const server=http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",  // Allow from any origin or use exact Render frontend URL
      methods: ["GET", "POST"]
    }
  });

//To "ON" the circuit we need to write io.on()
io.on("connection",(socket)=>{
    console.log(socket.id);

    //CREATING ROUTES
    socket.on("join_room",(data)=>{
        console.log("this is join room",data);
        socket.join(data);
        console.log(`User Id :- ${socket.id} join room :- ${data}`)
    })

    //To get the message

    socket.on("send_message",(data)=>{
        console.log("send message data",data);   
        socket.to(data.room).emit("receive_message",data);
    })
    //Let's receive the data
    
    socket.on("disconnet",()=>{
        console.log("USER DISCONNECTED",socket.id);
    })
}); // IT WON"T BE working until connection is hit
//middleware
app.use(cors());
const port = process.env.PORT || 2000;
server.listen(port,()=>{
    console.log(`sever is running on ${port}`)
})
