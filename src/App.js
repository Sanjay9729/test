import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import ViewWarranty from './pages/ViewWarranty';
import EditWarranty from './pages/EditWarranty';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/submission" element={<ViewWarranty />} />
        <Route path="/" element={<Home />} />
         <Route path="/edit/:id" element={<EditWarranty />} />
      </Routes>
    </Router>
  );
}

export default App;