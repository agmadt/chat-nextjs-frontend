import ChatBubble from './bubble'
import ChatParticipant from './participant'
import { useState, useEffect } from 'react'
import AuthContainer from '../../containers/AuthContainer'

export default function Chat(props) {

  const auth = AuthContainer.useContainer();

  const [chatText, setChatText] = useState('')
  const [chats, setChats] = useState([])
  const [participants, setParticipants] = useState([])
  const [roomID, setRoomID] = useState(props.room_id)
  const [, forceUpdate] = useState(0);

  const chatSubmitHandler = () => {
    if (!chatText) {
      return;
    }

    fetch(process.env.NEXT_PUBLIC_API_URL + '/chats', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth.data.token
      },
      body: JSON.stringify({
        user_id: auth.data.user.id,
        room_id: roomID,
        message: chatText
      })
    })

    setChatText('')
  }

  useEffect(() => {

    let localData = localStorage.getItem("dollars");

    if (!localData) {
      return;
    }

    let localDataObj = JSON.parse(localData);
    
    async function iife() {

      if (localDataObj.user.room_id != roomID) {
        await fetch(process.env.NEXT_PUBLIC_API_URL + '/chatrooms/join', {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localDataObj.token
          },
          body: JSON.stringify({
            user_id: localDataObj.user.id,
            room_id: roomID
          })
        })
      }

      const me = await fetch(process.env.NEXT_PUBLIC_API_URL + '/me', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localDataObj.token
        },
        body: JSON.stringify({
          id: localDataObj.user.id,
        })
      })

      const meData = await me.json()

      if (me.status == 200) {
        localData = JSON.stringify({
          auth: true,
          token: meData.token,
          user: meData.data
        });

        localStorage.setItem("dollars", localData);
        localDataObj = JSON.parse(localData);
        auth.storeData(localDataObj);
      }

      const chatroom = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chatrooms/' + roomID)
      const chatroomData = await chatroom.json();
      setParticipants(chatroomData.participants)
    }
    
    iife();
    
    // open ws connection
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL+`?user_id=`+localDataObj.user.id+`&room_id=`+localDataObj.user.id);

    let currentChats = [];

    socket.onmessage = (event) => {
      let data = JSON.parse(event.data);

      if (data.room_id != roomID) {
        return;
      }

      if (data.type == 'CHAT_MESSAGE') {
        currentChats.push({
          id: Math.random(),
          name: data.user.email,
          message: data.message,
        })

        setChats(currentChats)
        forceUpdate(n => !n)
      }
      
      if (data.type == 'JOIN_ROOM' || data.type == 'LEAVE_ROOM') {
        currentChats.push({
          id: Math.random(),
          name: data.user.email,
          message: data.type == "JOIN_ROOM" ? "Joined the room" : "Leave room",
        })

        setParticipants(data.participants)
        setChats(currentChats)
      }
    }
    forceUpdate(n => !n)
  }, [])

  const submitButtonClass = chatText.length > 0 ? '' : 'disabled cursor-not-allowed bg-gray-600 hover:bg-gray-600';

  return (
    <>
      <div className="chat-container w-full bg-gray-800 p-4 mb-2 border border-black relative">
        <div className="chat__screen-box w-full h-full bg-gray-700 p-2 overflow-y-scroll">
          <div className="chat__message-container mb-2">
            <div className="w-9/12 h-64">
              {chats.map((element) => (
                <ChatBubble key={element.id} chat={element} />
              ))}
            </div>
          </div>
        </div>
        <div className="chat__participant-list w-2/12 text-white text-right absolute mr-12 mt-4 right-0 top-0">
          {participants.map((element) => (
            <ChatParticipant key={element.id} participant={element} />
          ))}
        </div>
        <div className="chat__text-box">
          <textarea className="p-2 w-full h-24 mb-2 border border-black" 
            placeholder="Write here" onChange={(evt) => setChatText(evt.target.value)} value={chatText}></textarea>
          <input type="submit" value="Send" className={'w-full px-4 pb-2 pt-1 border border-black text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-100 cursor-pointer' + submitButtonClass} onClick={chatSubmitHandler} />
        </div>
      </div>
    </>
  )
}