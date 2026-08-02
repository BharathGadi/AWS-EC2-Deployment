import { useState, useEffect } from "react";

export default function SSEStream() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   // 1. Native browser API for Server-Sent Events! No fetch() required.
  //   const eventSource = new EventSource("http://localhost:3000/api/events");

  //   // 2. Fires when the connection opens
  //   eventSource.onopen = () => {
  //     setIsConnected(true);
  //   };

  //   // 3. Fires automatically EVERY TIME the server sends `data: ...\n\n`
  //   eventSource.onmessage = (event) => {
  //     // event.data contains the string sent by the server
  //     const parsedData = JSON.parse(event.data);

  //     setMessages((prev) => {
  //       // Keep only the last 5 messages so the UI doesn't get cluttered
  //       const newMessages = [...prev, parsedData];
  //       if (newMessages.length > 5) newMessages.shift();
  //       return newMessages;
  //     });
  //   };

  //   // 4. Fires if the server crashes or network drops
  //   eventSource.onerror = (error) => {
  //     console.error("SSE Error:", error);
  //     setIsConnected(false);
  //     // The amazing part: EventSource will AUTOMATICALLY try to reconnect after a few seconds!
  //   };

  //   // Cleanup when component unmounts (equivalent to AbortController)
  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  return (
    <div style={{ maxWidth: "600px", marginTop: "30px" }}>
      <h2>Module 8: Server-Sent Events (SSE)</h2>
      <p style={{ color: "#555", lineHeight: "1.5" }}>
        Notice we didn't have to write a <code>while</code> loop, use{" "}
        <code>TextDecoder</code>, or split buffers manually. The browser handles
        all of the heavy lifting. If you stop the Node server, you'll see the
        status go red, and if you start it again, it reconnects automatically!
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            background: isConnected ? "#4CAF50" : "#ff4444",
            boxShadow: isConnected ? "0 0 10px #4CAF50" : "0 0 10px #ff4444",
          }}
        ></div>
        <strong>
          {isConnected ? "Connected to SSE" : "Disconnected (Reconnecting...)"}
        </strong>
      </div>

      <div
        style={{
          background: "#f0f8ff",
          padding: "15px",
          minHeight: "150px",
          borderRadius: "8px",
          border: "1px solid #b6d4fe",
        }}
      >
        {messages.length === 0
          ? "Waiting for events..."
          : messages.map((msg, i) => (
              <div
                key={i}
                style={{ padding: "8px 0", borderBottom: "1px solid #ddd" }}
              >
                <strong style={{ color: "#0056b3" }}>[{msg.time}]</strong>{" "}
                {msg.message}
              </div>
            ))}
      </div>
    </div>
  );
}
