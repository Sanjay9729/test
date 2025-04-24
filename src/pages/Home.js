import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
      } else {
        navigate('/login')
      }
    }

    getUser()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const formatDisplayName = (email) => {
    if (!email) return 'User'

    const namePart = email.split('@')[0]
    return namePart.replace(/\./g, ' ')
  }

  return (
    <div style={{ padding: 20 }}>
      {user ? (
        <>
          <h2>Welcome! {formatDisplayName(user.email)}</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Home