import { useState } from "react";

export default function ErrorStream() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const startStream = async () => {
    setLogs([]);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/unstable");
      
      // 1. Catch standard HTTP errors before we even start reading
      if (!res.ok) {
        throw new Error(`HTTP Error! Status: ${res.status}`);
      }
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        // 2. If the backend crashes mid-stream, reader.read() will THROW an error
        // which immediately skips to our catch block below!
        const { done, value } = await reader.read();
        
        if (done) {
          setLogs((prev) => [...prev, "Stream completed normally!"]);
          break;
        }

        const chunk = decoder.decode(value);
        setLogs((prev) => [...prev, chunk]);
      }
      
    } catch (err) {
      // 3. Gracefully handle the mid-stream failure so the UI doesn't crash
      console.error("Caught stream error:", err);
      setError(`Stream Interrupted: ${err.message}. Please try again later.`);
    }
  };

  return (
    <div style={{ maxWidth: "600px", marginTop: "30px" }}>
      <h2>Module 5: Error Handling</h2>
      <p style={{ color: "#555" }}>
        Streams are fragile. The user could drive into a tunnel and lose cell service, or the server could crash while sending data.
      </p>

      <button onClick={startStream} style={{ padding: "10px", cursor: "pointer" }}>
        Fetch Unstable Stream
      </button>
      
      <div style={{ 
        background: "#222", 
        color: "#0f0", 
        padding: "15px", 
        marginTop: "15px", 
        minHeight: "100px", 
        fontFamily: "monospace",
        borderRadius: "4px"
      }}>
        {logs.map((log, i) => <div key={i}>{log}</div>)}
        
        {/* Render the error state nicely instead of a white screen crash */}
        {error && (
          <div style={{ color: "#ff4444", marginTop: "10px", fontWeight: "bold" }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
