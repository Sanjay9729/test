import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import createApp from "@shopify/app-bridge";
import Auth from "./pages/Auth";
import ViewWarranty from "./pages/ViewWarranty";

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
      </Routes>
    </Router>
  );
}

export default App;
