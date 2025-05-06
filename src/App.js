import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import ViewWarranty from './pages/ViewWarranty';

function App() {
  const host = new URLSearchParams(window.location.search).get("host");

  const config = {
    apiKey: "your-shopify-api-key", // ⛔️ Replace this!
    host: host,
    forceRedirect: true,
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<ViewWarranty />} />     
        <Route path="/home" element={<Home />} />        
      </Routes>
    </Router>
  );
}

export default App;
