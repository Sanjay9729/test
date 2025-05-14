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
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
          Welcome! {formatDisplayName(user.email)}
        </h2>
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          Email: {user.email}
        </p>
        <button style={{
          background: "black",
          color: "white",
          padding: "10px 16px",
          fontSize: "16px",
          border: "none",
          cursor: "pointer"
        }} onClick={handleLogout}>
          Logout
        </button>
      </>
    ) : (
      <p>Loading...</p>
    )}
  </div>
  )
}

export default Home