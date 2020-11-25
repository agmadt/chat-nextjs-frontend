import Room from './room'
import {useEffect, useState} from 'react'

export default function List(props) {
  const [chatrooms, setChatrooms] = useState(props.chatrooms)

  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL+'/chatrooms');
    socket.onmessage = (event) => {
      let data = JSON.parse(event.data);
      console.log(data)

      if (data.type == "CHATROOMS") {
        setChatrooms(data.chatrooms)
      }
    }
  })

  return (
    <>
      {chatrooms.map((element) => (
        <Room key={element.id} data={element} />
      ))}
    </>
  )
}
  