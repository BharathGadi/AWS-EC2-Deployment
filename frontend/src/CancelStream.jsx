import { useState, useRef } from "react";

export default function CancelStream() {
  const [logs, setLogs] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // We use a React ref to store the controller.
  // This allows our Stop button to access the EXACT SAME controller across re-renders.
  const abortControllerRef = useRef(null);

  const startStream = async () => {
    setLogs([]);
    setIsStreaming(true);

    // 1. Create a fresh remote control for this specific request
    abortControllerRef.current = new AbortController();

    try {
      // 2. Pass the controller's "signal" into the fetch options
      const res = await fetch("http://localhost:3000/api/long-task", {
        signal: abortControllerRef.current.signal,
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setLogs((prev) => [...prev, "✅ Stream finished completely!"]);
          setIsStreaming(false);
          break;
        }

        const chunk = decoder.decode(value);
        setLogs((prev) => [...prev, chunk]);
      }
    } catch (err) {
      // 3. The catch block intercepts the Abort!
      if (err.name === "AbortError") {
        setLogs((prev) => [...prev, "🛑 STREAM CANCELLED BY USER!"]);
      } else {
        setLogs((prev) => [...prev, `❌ Error: ${err.message}`]);
      }
      setIsStreaming(false);
    }
  };

  const stopStream = () => {
    // 4. Press the kill switch!
    // This instantly destroys the network pipe, causing the fetch to throw an AbortError
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div style={{ maxWidth: "600px", marginTop: "30px" }}>
      <h2>Module 7: Cancellation (AbortController)</h2>
      <p style={{ color: "#555" }}>
        Start the stream, and then click Stop before it finishes to see the
        connection severed!
        <strong>
          {" "}
          Check your backend terminal when you click Stop to see it catch the
          event.
        </strong>
      </p>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={startStream}
          disabled={isStreaming}
          style={{
            padding: "10px 20px",
            cursor: isStreaming ? "not-allowed" : "pointer",
          }}
        >
          Start Long Task (15s)
        </button>

        <button
          onClick={stopStream}
          disabled={!isStreaming}
          style={{
            padding: "10px 20px",
            background: isStreaming ? "#ff4444" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isStreaming ? "pointer" : "not-allowed",
            fontWeight: "bold",
          }}
        >
          🛑 STOP STREAM
        </button>
      </div>

      <div
        style={{
          background: "#f4f4f4",
          padding: "15px",
          marginTop: "15px",
          minHeight: "200px",
          fontFamily: "monospace",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      >
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
