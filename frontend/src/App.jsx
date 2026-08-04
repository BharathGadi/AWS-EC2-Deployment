import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState } from "react";
import AiChat from "./AiChat";
import FramedStream from "./FramedStream";
import ErrorStream from "./ErrorStream";
import CancelStream from "./CancelStream";
import SSEStream from "./SSEStream";
import CookiesBasics from "./CookiesBasics";
import CookieSecurity from "./CookieSecurity";
import CookieScoping from "./CookieScoping";

// Layout wrapper component
function Layout({ children }) {
  // Sidebar styling helper
  const linkStyle = ({ isActive }) => ({
    textAlign: "left",
    padding: "10px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "block",
    backgroundColor: isActive ? "#3b82f6" : "transparent",
    color: isActive ? "white" : "#cbd5e1",
    fontWeight: isActive ? "600" : "400",
    transition: "all 0.2s"
  });

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
      backgroundColor: "#f8fafc",
      color: "#0f172a"
    }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: "280px",
        backgroundColor: "#1e293b",
        color: "#f1f5f9",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        borderRight: "1px solid #334155"
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#f8fafc" }}>
            🚀 Dev Sandbox
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
            System Design & Core Protocol Learning
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", tracking: "0.05em", color: "#64748b", fontWeight: "bold", margin: "10px 0 4px 0" }}>
            Legacy Code
          </div>
          
          <NavLink to="/streaming" style={linkStyle}>
            🌊 HTTP Streaming
          </NavLink>

          <div style={{ fontSize: "11px", textTransform: "uppercase", tracking: "0.05em", color: "#64748b", fontWeight: "bold", margin: "16px 0 4px 0" }}>
            Cookies Learning Series
          </div>

          <NavLink to="/cookies-basics" style={linkStyle}>
            🍪 Module 1: HTTP Basics
          </NavLink>

          {/* Active link for Module 2 */}
          <NavLink to="/cookies-security" style={linkStyle}>
            🔒 Module 2: Security Flags
          </NavLink>
          
          {/* Active link for Module 3 */}
          <NavLink to="/cookies-lifespan" style={linkStyle}>
            🕒 Module 3: Scopes & Lifespan
          </NavLink>

          <button 
            disabled 
            style={{
              textAlign: "left",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "transparent",
              color: "#475569",
              cursor: "not-allowed"
            }}
          >
            🔒 Module 4: JWT Sessions
          </button>

          <button 
            disabled 
            style={{
              textAlign: "left",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "transparent",
              color: "#475569",
              cursor: "not-allowed"
            }}
          >
            🔒 Module 5: CORS & Creds
          </button>
        </nav>

        <div style={{ fontSize: "11px", color: "#64748b" }}>
          Antigravity Learning Engine v1.0
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}

// Separate view components for routes
function StreamingView() {
  const [streamData, setStreamData] = useState("");
  
  const startStream = async () => {
    setStreamData("Connecting to stream...\n");
    try {
      const res = await fetch("http://localhost:3000/api/stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setStreamData((prev) => prev + "\n🎉 Stream Complete!");
          break;
        }
        const chunk = decoder.decode(value);
        setStreamData((prev) => prev + chunk);
      }
    } catch (error) {
      setStreamData(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ margin: 0 }}>HTTP Chunked Streaming Demo</h1>
      <p style={{ color: "#64748b", margin: 0 }}>This section stores your initial multi-stream learning modules.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h2>HTTP Chunked Stream</h2>
          <button onClick={startStream} style={{ background: "#3b82f6", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}>Start Stream</button>
          <pre style={{ background: "#f1f5f9", padding: "12px", borderRadius: "6px", marginTop: "12px", maxHeight: "150px", overflowY: "auto" }}>
            {streamData || "Ready..."}
          </pre>
        </div>
        <AiChat />
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #e2e8f0" }} />
      <FramedStream />
      
      <hr style={{ border: "0", borderTop: "1px solid #e2e8f0" }} />
      <ErrorStream />
      
      <hr style={{ border: "0", borderTop: "1px solid #e2e8f0" }} />
      <CancelStream />
      
      <hr style={{ border: "0", borderTop: "1px solid #e2e8f0" }} />
      <SSEStream />
    </div>
  );
}

function CookiesBasicsView() {
  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ margin: "0 0 8px 0" }}>System Design: Cookies</h1>
      <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>
        Learn HTTP transmission headers, state management limits, and cookie lifecycle controls.
      </p>
      <CookiesBasics />
    </div>
  );
}

function CookieSecurityView() {
  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ margin: "0 0 8px 0" }}>System Design: Cookie Security</h1>
      <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>
        Deep dive into HttpOnly, Secure, and SameSite mechanisms to protect sessions.
      </p>
      <CookieSecurity />
    </div>
  );
}

function CookieScopingView() {
  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ margin: "0 0 8px 0" }}>System Design: Cookie Scopes & Lifespan</h1>
      <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>
        Understand Session vs Persistent cookies, client clock dependency, and Path restriction scoping.
      </p>
      <CookieScoping />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Default path redirects to cookies-basics */}
          <Route path="/" element={<Navigate to="/cookies-basics" replace />} />
          <Route path="/streaming" element={<StreamingView />} />
          <Route path="/cookies-basics" element={<CookiesBasicsView />} />
          <Route path="/cookies-security" element={<CookieSecurityView />} />
          <Route path="/cookies-lifespan" element={<CookieScopingView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
