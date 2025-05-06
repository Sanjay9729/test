import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import Auth from "./pages/Auth";
import ViewWarranty from "./pages/ViewWarranty";

function App() {
  const host = new URLSearchParams(window.location.search).get("host");

  const config = {
    apiKey: "43db155c41abc41f085ba33378e97fa0", 
    host: host,
    forceRedirect: true,
  };

  return (
    <Provider config={config}>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<ViewWarranty />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
