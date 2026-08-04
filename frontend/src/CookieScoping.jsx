import { useState } from "react";

function CookieScoping() {
  const [backendMessage, setBackendMessage] = useState("");
  const [clientJsCookies, setClientJsCookies] = useState("");
  const [cookiesInfo, setCookiesInfo] = useState(null);

  const fetchOptions = {
    credentials: "include",
  };

  const setSessionCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/lifespan/session", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  const setPersistentCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/lifespan/persistent", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  const setExpiresCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/lifespan/expires", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  const setPathScopedCookie = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/lifespan/path-scoped", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  const testNormalPath = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/get", fetchOptions);
      const data = await res.json();
      setCookiesInfo(data);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  const testSpecialPath = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/lifespan/special/test", fetchOptions);
      const data = await res.json();
      setCookiesInfo({
        success: data.success,
        rawHeader: data.cookiesReceived,
        parsedCookies: data.cookiesReceived
      });
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  const clearCookies = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cookies/lifespan/clear", fetchOptions);
      const data = await res.json();
      setBackendMessage(data.message);
      setClientJsCookies("");
      setCookiesInfo(null);
    } catch (err) {
      setBackendMessage("Error: " + err.message);
    }
  };

  const readViaJavascript = () => {
    setClientJsCookies(document.cookie || "No cookies readable by JS");
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
      <h2 style={{ marginTop: 0, color: "#1e293b" }}>🕒 Module 3: Cookie Lifespans & Scoping</h2>
      <p style={{ color: "#64748b" }}>
        Experiment with Session-level storage, Absolute vs Relative expiration limits, and Path restriction scoping.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        
        {/* Setters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderRight: "1px solid #e2e8f0", paddingRight: "16px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>1. Set Expiries & Scopes</h3>
          
          <button onClick={setSessionCookie} style={{ background: "#3b82f6", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Set Session Cookie (RAM)
          </button>
          
          <button onClick={setPersistentCookie} style={{ background: "#10b981", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Set Persistent Cookie (Max-Age=60s)
          </button>
          
          <button onClick={setExpiresCookie} style={{ background: "#8b5cf6", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Set Expires Cookie (Expires in 2m)
          </button>

          <button onClick={setPathScopedCookie} style={{ background: "#e2e8f0", color: "#1e293b", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            Set Path-Scoped Cookie (/api/.../special)
          </button>

          <button onClick={clearCookies} style={{ background: "#ef4444", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "12px" }}>
            Clear Lifespan Cookies
          </button>
        </div>

        {/* Verifiers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>2. Test Path & Time Scoping</h3>
          
          <button onClick={readViaJavascript} style={{ background: "#0f172a", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Read Client-Side (document.cookie)
          </button>
          <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px", fontSize: "12px", wordBreak: "break-all" }}>
            <code>{clientJsCookies || "No JS check run"}</code>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={testNormalPath} style={{ flex: 1, background: "#f59e0b", color: "white", padding: "8px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Call Normal Path (/api/cookies/get)
            </button>
            <button onClick={testSpecialPath} style={{ flex: 1, background: "#ec4899", color: "white", padding: "8px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Call Special Path (.../special/test)
            </button>
          </div>
        </div>
      </div>

      {backendMessage && (
        <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", borderLeft: "4px solid #3b82f6", marginBottom: "12px" }}>
          <strong>Status:</strong> {backendMessage}
        </div>
      )}

      {cookiesInfo && (
        <div>
          <strong>Server Header Audit:</strong>
          <pre style={{ background: "#1e293b", color: "#38bdf8", padding: "16px", borderRadius: "8px", overflowX: "auto", marginTop: "6px" }}>
            {JSON.stringify(cookiesInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default CookieScoping;
