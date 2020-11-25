import { useEffect } from 'react';
import Router from "next/router";
import AuthContainer from '../containers/AuthContainer'
import Link from 'next/link';

export default function Header() {

  const auth = AuthContainer.useContainer();

  useEffect(() => {
    
    const localData = localStorage.getItem("dollars");
    const localDataObj = JSON.parse(localData);

    if (localData && localData.length > 2) {
      auth.storeData(localDataObj);
      if (localDataObj.user.room_id) {
        Router.push('/chatrooms/'+JSON.parse(localStorage.getItem("dollars")).user.room_id);
      }
    } else {
      Router.push('/login');
    }

  }, [])

  const handleLogout = () => {
    if(!confirm("Are you sure?")) {
      return;
    }

    const localData = localStorage.getItem("dollars");
    const localDataObj = JSON.parse(localData);
    
    fetch(process.env.NEXT_PUBLIC_API_URL + '/logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localDataObj.token
      },
      body: JSON.stringify({
        id: localDataObj.user.id
      })
    });

    localStorage.setItem("dollars", JSON.stringify({}))

    Router.push('/login')
  };

  const handleLogin = () => {
    Router.push('/login')
  };

  const handleLeaveRoom = async () => {
    if(!confirm("Are you sure?")) {
      return;
    }
    
    const localData = localStorage.getItem("dollars");
    const localDataObj = JSON.parse(localData);

    await fetch(process.env.NEXT_PUBLIC_API_URL + '/chatrooms/leave', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth.data.token
      },
      body: JSON.stringify({
        user_id: localDataObj.user.id,
        room_id: localDataObj.user.room_id
      })
    });

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
      localStorage.setItem("dollars", JSON.stringify({
        auth: true,
        token: meData.token,
        user: meData.data
      }));

      Router.push('/')
    }
  };

  return (
    <>
      <div className="header bg-gray-800 mt-2 px-8 pb-2 pt-1 clearfix">
      <div className="header__title float-left">
        <span className="text-4xl text-white">DOLLARS</span>
        {auth.data.auth ? (
          <span className="text-white"> -- {auth.data.user.email}</span>
        ) : ''}
      </div>
      <div className="header__auth-section float-right pt-3">
        <div className="header__auth-section__user"></div>
        {auth.data.auth ? (
          <>
            { auth.data.user.room_id ? (
              <button className="header__auth-section__login-button px-4 pb-2 pt-1 mr-2 border border-black text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-100 cursor-pointer" onClick={handleLeaveRoom}>Leave Room</button>
            ) : (
              <Link href={`chatrooms/create`}>
                <button className="header__auth-section__login-button px-4 pb-2 pt-1 mr-2 border border-black text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-100 cursor-pointer">Create Room</button>
              </Link>
            )}
            <button className="header__auth-section__login-button px-4 pb-2 pt-1 border border-black text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button className="header__auth-section__login-button w-full px-4 pb-2 pt-1 border border-black text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-100 cursor-pointer" onClick={handleLogin}>Login</button>
        )}
      </div>
      </div>
    </>
  );
}
