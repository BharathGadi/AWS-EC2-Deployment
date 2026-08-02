import { useState } from "react";

export default function FramedStream() {
  const [users, setUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const startStream = async () => {
    setUsers([]); // Reset state
    setIsFetching(true);

    try {
      const res = await fetch("http://localhost:3000/api/users-stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = ""; // This buffer holds incomplete chunks

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // stream: true ensures multi-byte characters aren't accidentally split
        buffer += decoder.decode(value, { stream: true });
        console.log(buffer);

        // 1. Split our accumulated buffer by our delimiter (newline)
        const parts = buffer.split("\n");
        console.log(parts);

        // 2. The very last part might be an incomplete JSON string
        // so we pop it off the array and put it back into the buffer
        buffer = parts.pop();
        console.log("Buffer after pop:", buffer, parts);

        // 3. Process all the fully complete JSON strings
        for (const part of parts) {
          if (part.trim()) {
            const parsedUser = JSON.parse(part);
            setUsers((prev) => [...prev, parsedUser]);
          }
        }
      }
    } catch (error) {
      console.error("Stream failed:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", marginTop: "30px" }}>
      <h2>Module 4: Production Framing (JSONL)</h2>

      <button
        onClick={startStream}
        disabled={isFetching}
        style={{ padding: "10px", cursor: "pointer" }}
      >
        {isFetching ? "Streaming Users..." : "Fetch Users (JSONL)"}
      </button>

      <div style={{ marginTop: "15px" }}>
        {users.length === 0 && !isFetching && (
          <div style={{ color: "#888" }}>Waiting for users...</div>
        )}

        {users.map((user) => (
          <div
            key={user.id}
            style={{
              background: "#e3f2fd",
              padding: "10px",
              margin: "5px 0",
              borderRadius: "4px",
              border: "1px solid #90caf9",
              transition: "all 0.3s ease",
              animation: "fadeIn 0.5s",
            }}
          >
            <strong>{user.name}</strong> -{" "}
            <span style={{ color: "#555" }}>{user.role}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
