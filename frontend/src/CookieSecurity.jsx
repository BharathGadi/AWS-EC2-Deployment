import { useState } from "react";

function CookieSecurity() {
  const [backendMessage, setBackendMessage] = useState("");
  const [clientJsCookies, setClientJsCookies] = useState("");
  const [cookiesInfo, setCookiesInfo] = useState(null);

  const fetchOptions = {
    credentials: "include",
  };

  // 1. Set standard cookie (insecure/client-readable)
  const setUnsafeCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/security/unsafe", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  // 2. Set HttpOnly cookie (secure from JS)
  const setHttpOnlyCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/security/httponly", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  // 3. Set SameSite Strict cookie (secure from cross-site navigation)
  const setSameSiteStrictCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/security/samesite", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  // Read cookies using client-side JavaScript (document.cookie)
  const readViaJavascript = () => {
    setClientJsCookies(document.cookie || "No cookies readable by JavaScript (document.cookie is empty)");
  };

  // Query server to see what cookies the server actually receives
  const queryServerCookies = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/get", fetchOptions);
      const data = await res.json();
      setCookiesInfo(data);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  // Clear all security demonstration cookies
  const clearSecurityCookies = async () => {
    try {
      await fetch("http://localhost:3000/api/cookies/security/clear", fetchOptions);
      setBackendMessage("Demo security cookies cleared!");
      setClientJsCookies("");
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
      <h2 style={{ marginTop: 0, color: "#1e293b" }}>🔒 Module 2: Cookie Security Attributes</h2>
      <p style={{ color: "#64748b" }}>
        Observe how security flags (<code>HttpOnly</code>, <code>Secure</code>, and <code>SameSite</code>) affect browser behavior and client-side JS accessibility.
      </p>

      {/* Control Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        
        {/* Setters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderRight: "1px solid #e2e8f0", paddingRight: "16px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>Step 1: Set Demonstration Cookies</h3>
          
          <button 
            onClick={setUnsafeCookie} 
            style={{ background: "#fbbf24", color: "#1e293b", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
          >
            Set Standard Cookie (Unsafe)
          </button>
          
          <button 
            onClick={setHttpOnlyCookie} 
            style={{ background: "#10b981", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
          >
            Set HttpOnly Cookie (Safe from XSS)
          </button>
          
          <button 
            onClick={setSameSiteStrictCookie} 
            style={{ background: "#3b82f6", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
          >
            Set SameSite=Strict Cookie (Safe from CSRF)
          </button>

          <button 
            onClick={clearSecurityCookies} 
            style={{ background: "#64748b", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "8px" }}
          >
            Clear Security Cookies
          </button>
        </div>

        {/* Readers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>Step 2: Inspect Accessibility</h3>
          
          <div>
            <button 
              onClick={readViaJavascript} 
              style={{ background: "#8b5cf6", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%", fontWeight: "600" }}
            >
              Read via Client JS (document.cookie)
            </button>
            <div style={{
              background: "#f1f5f9",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "13px",
              marginTop: "6px",
              wordBreak: "break-all",
              minHeight: "40px"
            }}>
              <code>{clientJsCookies}</code>
            </div>
          </div>

          <button 
            onClick={queryServerCookies} 
            style={{ background: "#0f172a", color: "white", padding: "10px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Query Server to verify what reached Backend
          </button>
        </div>
      </div>

      {backendMessage && (
        <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", borderLeft: "4px solid #3b82f6", marginBottom: "12px" }}>
          <strong>Status:</strong> {backendMessage}
        </div>
      )}

      {cookiesInfo && (
        <div style={{ marginTop: "12px" }}>
          <strong>Backend Received Cookies:</strong>
          <pre style={{
            background: "#1e293b",
            color: "#38bdf8",
            padding: "16px",
            borderRadius: "8px",
            overflowX: "auto",
            marginTop: "6px"
          }}>
            {JSON.stringify(cookiesInfo.parsedCookies, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default CookieSecurity;
