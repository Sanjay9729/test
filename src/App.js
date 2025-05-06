import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import ViewWarranty from './pages/ViewWarranty';

function App() {
  useEffect(() => {
    const host = new URLSearchParams(window.location.search).get("host");

    createApp({
      apiKey: "43db155c41abc41f085ba33378e97fa0", 
      host: host,
      forceRedirect: true,
    });
  }, []);

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