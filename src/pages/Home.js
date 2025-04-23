// src/pages/Home.js
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome! Sanjay</h2>
      {user && <p>Email: {user.email}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
