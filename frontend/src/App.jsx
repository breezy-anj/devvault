import { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "../components/Dashboard.jsx";
import Login from "../components/Login.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("devvault_token"));

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const handleLogout = () => {
    localStorage.removeItem("devvault_token");
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
