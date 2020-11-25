import Router from 'next/router'
import { useState, useEffect } from 'react'
import AuthContainer from '../containers/AuthContainer'

export default function Room(props) {
  
  const auth = AuthContainer.useContainer();
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async () => {

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    const data = await response.json()

    if (response.status == 200) {
      let localData = JSON.stringify({
        auth: true,
        token: data.token,
        user: data.data
      });

      localStorage.setItem("dollars", localData);

      auth.storeData(JSON.parse(localData));

      Router.push('/')
    } else {
      setErrorMessage(data.message)
    }
  };

  useEffect(() => {
    if (localStorage.getItem("dollars") && localStorage.getItem("dollars").length > 2) {
      Router.push('/chatrooms/'+JSON.parse(localStorage.getItem("dollars")).user.room_id);
    }

  }, [])

  return (
    <>
      <h1 className="text-center text-5xl mb-4 font-medium">Login</h1>
      <div className="bg-gray-800 text-left w-5/12 mx-auto p-4 shadow-2xl rounded">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
            <input type="text" id="email" name="email" className="mt-2 w-full px-2 py-1 rounded text-black" 
              value={email} onChange={(evt) => { setEmail(evt.target.value) }} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
            <input type="password" id="password" name="password" className="mt-2 w-full px-2 py-1 rounded" 
              value={password} onChange={(evt) => { setPassword(evt.target.value) }} />
          </div>
          <div className="mt-4">
            <div className="text-2xl text-white">{errorMessage}</div>
          </div>
          <div className="mt-4">
            <input type="submit" className="w-full px-4 pb-2 pt-1 border border-black text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-100 cursor-pointer" value="Login" onClick={handleLogin}/>
          </div>
      </div>
    </>
  )
}
    