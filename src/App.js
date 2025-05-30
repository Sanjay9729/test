import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import Auth from './pages/Auth';
import Home from './pages/Home';
import ViewWarranty from './pages/ViewWarranty';
import SubmissionsList from './pages/SubmissionsList';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default StartPage */}
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/submission" element={<ViewWarranty />} />
        <Route path="/submissionslist" element={<SubmissionsList />} />
      </Routes>
    </Router>
  );
}

export default App;
