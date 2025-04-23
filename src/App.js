// src/App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Authentication from './pages/Authentication'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/Authentication" element={<Authentication />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
