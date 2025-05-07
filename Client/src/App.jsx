import React from 'react'
import { useState } from 'react'
import Chat from './Chat'
import io from 'socket.io-client'
import music from './music.wav'


const socket=io.connect("http://localhost:2000")  //ISme krna hai backend ka url AND cors ke orgin mai krna hai Frontend ka url 

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showchat, setShowchat] = useState(false);

  const notification= new Audio(music);

  const join_chat=()=>{
    if(username!="" && room!=""){
      //hit the route by using socket.emit(route_name);
      socket.emit("join_room",room);
      setShowchat(true);
      notification.play();
    }
  }
  return (
    <>
    {
      !showchat && (
        <div className="join_room">
      <h1>
        Join Chat
      </h1>
      <input type="text" placeholder='enter your name' 
      onChange={(e)=>{
        setUsername(e.target.value)
      }}
      />
      <input type="text" name="" placeholder="enter chat room" id=""
      onChange={(e)=>{
        setRoom(e.target.value)
      }} />
      <button onClick={join_chat}>Join</button>
    </div>
      )
    }
    {
      showchat && (
        <Chat socket={socket} username={username} room={room}/>
      )
    }

    
    </>
  )
}

export default App