import { useState } from 'react'
import { createContainer } from 'unstated-next'

function useCounter() {
  let defaultAuthData = {
    auth: false,
    token: null,
    user: {
      id: null,
      email: null,
      room_id: null
    }
  }

  const [data, setData] = useState(defaultAuthData)
  const storeData = (authData) => setData(authData)

  return { data, storeData }
}

export default createContainer(useCounter)