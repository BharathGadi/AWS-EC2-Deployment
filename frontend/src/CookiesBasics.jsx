import { useState } from "react";

function CookiesBasics() {
  const [backendMessage, setBackendMessage] = useState("");
  const [cookiesInfo, setCookiesInfo] = useState(null);
  
  // Notice the 'credentials: "include"' in options. This is required for cross-origin cookies.
  const fetchOptions = {
    credentials: "include", 
  };

  const handleSetCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/set", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  const handleGetCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/get", fetchOptions);
      const data = await res.json();
      setCookiesInfo(data);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  const handleClearCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/clear", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
      setCookiesInfo(null);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  return (
    <div style={{
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      padding: "24px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      margin: "20px 0"
    }}>
      <h2 style={{ marginTop: 0, color: "#1e293b" }}>🍪 Module 1: HTTP Cookie Basics</h2>
      <p style={{ color: "#64748b" }}>
        Test setting, reading, and clearing raw cookies sent over the network headers.
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button 
          onClick={handleSetCookie} 
          style={{ background: "#3b82f6", color: "white", padding: "10px 16px", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Set Cookie
        </button>
        <button 
          onClick={handleGetCookie} 
          style={{ background: "#10b981", color: "white", padding: "10px 16px", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Read Cookies from Server
        </button>
        <button 
          onClick={handleClearCookie} 
          style={{ background: "#ef4444", color: "white", padding: "10px 16px", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Clear Cookie
        </button>
      </div>

      {backendMessage && (
        <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", borderLeft: "4px solid #3b82f6", marginBottom: "12px" }}>
          <strong>Status:</strong> {backendMessage}
        </div>
      )}

      {cookiesInfo && (
        <pre style={{
          background: "#1e293b",
          color: "#38bdf8",
          padding: "16px",
          borderRadius: "8px",
          overflowX: "auto"
        }}>
          {JSON.stringify(cookiesInfo, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default CookiesBasics;
