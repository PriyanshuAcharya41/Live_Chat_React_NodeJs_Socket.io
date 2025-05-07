import React from 'react'
import { useState,useEffect,useRef } from 'react'
import music from './iphone.mp3'
const Chat = ({socket,username,room}) => {
    const [currentMessage, setCurrentMessage] = useState("")
    const [messageList, setMessageList] = useState([])
    
    const notification=new Audio(music);
    
    const sendMessage=async ()=>{
        if(currentMessage!==""){
            const messageData={
                id:Math.random(),
                room:room,
                author:username,
                message:currentMessage,
                time:new Date(Date.now()).getHours()%12 + ":"+new Date(Date.now()).getMinutes()
            }
            await socket.emit("send_message",messageData); //We send the data of our message
            setMessageList((list)=>[...list,messageData])
            setCurrentMessage("");
            notification.play();
        }
    }
    
    useEffect(() => {
      const handleReceiveMsg=(data)=>{
        setMessageList((list)=>[...list,data])
      }
      socket.on("receive_message",handleReceiveMsg);
    
      return () => {
        socket.off("receive_message",handleReceiveMsg);
      }
    }, [socket])

    //for automatic scrolling
    const containRef=useRef(null);
    useEffect(() => {
      containRef.current.scrollTop=containRef.current.scrollHeight
    }, [messageList])

    
    
  return (
      <>
      
      <div className="chat_container">
            <h1>Welcome {username}!</h1>
        <div className="chat_box">
            
            <div className="auto-scrolling-div" 
            ref={containRef} style={
                {
                    height:'85%',
                    overflowY:'auto',
                    
                }
            }>

            
            
            {
                messageList.map((data)=>(
                    <div key={data.id} className='message_content' id={username=== data.author ? "you":"other"}>
                        <div>
                            <div className="msg" id={username=== data.author ? "y":"g"}>
                                <p>{data.message}</p>
                            </div>
                            <div className="msg_detail" id={username=== data.author ? "sender":"receiver"}>
                                <p>{data.author}</p>
                                <p>{data.time}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
            </div>
            <div className="chat_body">
                <input id='input_chat_body'
                value={currentMessage} type="text" placeholder='Type Your Message' onChange={(e)=>{
                    setCurrentMessage(e.target.value);}}
                    onKeyPress={(e)=>{
                        e.key==="Enter" && sendMessage()
                    }} />
                <button id='button_chat_body'  onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
      </div>
    </>
  )
}

export default Chat
