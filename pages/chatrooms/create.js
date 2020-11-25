import Router from 'next/router'
import { useState, useEffect } from 'react'
import AuthContainer from '../../containers/AuthContainer'

export default function Room(props) {
  
  const auth = AuthContainer.useContainer();

  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleCreate = async () => {

    if (!name) {
      return;
    }

    let response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chatrooms/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth.data.token
      },
      body: JSON.stringify({
        name: name
      })
    })

    const chatroom = await response.json()

    if (response.status == 200) {
      Router.push('/chatrooms/'+chatroom.id)
    } else {
      setErrorMessage(chatroom.message)
    }
  };

  return (
    <>
      <h1 className="text-center text-5xl mb-4 font-medium">Create Room</h1>
      <div className="bg-gray-800 text-left w-5/12 mx-auto p-4 shadow-2xl rounded">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-white">Room Name</label>
            <input type="text" id="name" name="name" className="mt-2 w-full px-2 py-1 rounded text-black" 
              value={name} onChange={(evt) => { setName(evt.target.value) }} />
          </div>
          <div className="mt-4">
            <div className="text-2xl text-white">{errorMessage}</div>
          </div>
          <div className="mt-4">
            <input type="submit" className="w-full px-4 pb-2 pt-1 border border-black text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-100 cursor-pointer" value="Create Room" onClick={handleCreate}/>
          </div>
      </div>
    </>
  )
}
    