import { useState } from "react";
import AiChat from "./AiChat";
import FramedStream from "./FramedStream";
import ErrorStream from "./ErrorStream";
import CancelStream from "./CancelStream";
import SSEStream from "./SSEStream";

function App() {
  const [response, setResponse] = useState(null);

  // 🔥 NEW: State to hold our streaming data
  const [streamData, setStreamData] = useState("");

  const callBackend = async () => {
    // Note: If you don't have a Vite proxy, you usually need the full URL here
    // like http://localhost:3000/api, but I kept it as is if it's working for you!
    const res = await fetch("http://localhost:3000/api");
    const data = await res.json();
    setResponse(data);
  };

  // 🔥 NEW: Streaming Function 🔥
  const startStream = async () => {
    setStreamData("Connecting to stream...\n");

    try {
      const res = await fetch("http://localhost:3000/api/stream");

      // Get the reader from the response body
      const reader = res.body.getReader();
      const decoder = new TextDecoder(); // Decodes byte chunks into text

      // Infinite loop to keep reading chunks as they arrive
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setStreamData((prev) => prev + "\n🎉 Stream Complete!");
          break; // Exit the loop when server calls res.end()
        }

        // Decode the bytes into a string and append it to our React state
        const chunk = decoder.decode(value);
        setStreamData((prev) => prev + chunk);
      }
    } catch (error) {
      setStreamData(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>AWS CI/CD Cloudfront + S3 New</h1>

      {/* Your Existing Code */}
      <div style={{ marginBottom: 40 }}>
        <h2>Standard REST API</h2>
        <button onClick={callBackend}>Call Backend</button>
        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      </div>

      <hr style={{ margin: "20px 0" }} />

      <AiChat />

      <hr style={{ margin: "20px 0" }} />
      <FramedStream />

      <hr style={{ margin: "20px 0" }} />
      <ErrorStream />

      <hr style={{ margin: "20px 0" }} />
      <CancelStream />

      <hr style={{ margin: "20px 0" }} />
      <SSEStream />

      <hr />

      {/* 🔥 NEW: Module 1 UI 🔥 */}
      <div>
        <h2>Module 1: HTTP Streaming</h2>
        <button onClick={startStream}>Start Stream</button>
        <pre
          style={{
            background: "#f4f4f4",
            padding: "20px",
            marginTop: "10px",
            minHeight: "150px",
            borderRadius: "8px",
          }}
        >
          {streamData || "Waiting to start stream..."}
        </pre>
      </div>
    </div>
  );
}

export default App;
