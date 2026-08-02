const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Hello from EC2 Demo Backend 🚀",
  });
});

// Existing API route
app.get("/api", (req, res) => {
  res.json({
    success: true,
    data: {
      name: "Bharath",
      role: "Frontend Developer",
      learning: "AWS EC2",
    },
  });
});

// 🔥 NEW: Module 1 Streaming Route 🔥
app.get("/api/stream", (req, res) => {
  // Tell the browser this is a chunked stream
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  let count = 0;

  // Send a chunk every 1 second
  const interval = setInterval(() => {
    count++;
    res.write(
      `[Server] Streaming chunk ${count} at ${new Date().toLocaleTimeString()}\n`
    );

    // Stop the stream after 5 chunks
    if (count === 5) {
      clearInterval(interval);
      res.end(); // Officially close the connection
    }
  }, 1000);
});

// 🔥 NEW: Module 3 AI Chat Route 🔥
app.get("/api/chat", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  const aiMessage = "Hello! I am your AI assistant. I am generating this response word by word, just like ChatGPT does, using HTTP chunked streaming! Notice how smooth and fast the perceived performance is compared to waiting for the whole block of text? How cool is that?";
  
  const words = aiMessage.split(" ");
  let i = 0;

  const interval = setInterval(() => {
    if (i < words.length) {
      res.write(words[i] + " ");
      i++;
    } else {
      clearInterval(interval);
      res.end();
    }
  }, 100); 
});

// 🔥 NEW: Module 4 Production Patterns (Framing JSONL) 🔥
app.get("/api/users-stream", (req, res) => {
  res.setHeader("Content-Type", "application/x-ndjson"); // Newline delimited JSON
  res.setHeader("Transfer-Encoding", "chunked");
  
  const users = [
    { id: 1, name: "Alice", role: "Admin" , status: "active"},
    { id: 2, name: "Bob", role: "User" },
    { id: 3, name: "Charlie", role: "Moderator" },
    { id: 4, name: "Diana", role: "User" }
  ];
  
  let i = 0;
  
  const interval = setInterval(() => {
    if (i < users.length) {
      // Stringify the object and append a newline character as our delimiter!
      res.write(JSON.stringify(users[i]) + "\n");
      i++;
    } else {
      clearInterval(interval);
      res.end();
    }
  }, 800); // Wait 800ms between sending each user to see the streaming effect
});

// 🔥 NEW: Module 5 Error Handling 🔥
app.get("/api/unstable", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  let count = 0;
  
  // 🚨 CRITICAL SERVER FIX: Clean up if the client disconnects early!
  req.on('close', () => {
    console.log("Client dropped connection. Cleaning up server resources!");
    clearInterval(interval);
  });

  const interval = setInterval(() => {
    count++;
    res.write(`Sending safe chunk ${count}...\n`);

    if (count === 3) {
      // Simulate a catastrophic backend crash mid-stream
      res.write("Uh oh... server crashing!\n");
      clearInterval(interval);
      req.socket.destroy(); 
    }
  }, 1000);
});

// 🔥 NEW: Module 6 Backpressure 🔥
app.get("/api/backpressure", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  let i = 0;
  const totalChunks = 10000; // Sending a LOT of data to fill the buffer

  function writeChunks() {
    let isBufferHealthy = true;

    // Keep writing as long as the buffer is healthy and we have chunks left
    while (i < totalChunks && isBufferHealthy) {
      i++;
      // res.write returns FALSE if the Node.js internal RAM buffer gets full!
      isBufferHealthy = res.write(`Sending massive chunk of data ${i}...\n`);
    }

    if (i < totalChunks) {
      // The while loop broke because isBufferHealthy became false.
      // We MUST pause and wait for the network to drain the RAM buffer.
      console.log(`[Backpressure] Buffer full at chunk ${i}. Pausing and waiting for 'drain'...`);
      
      // The 'drain' event fires when the buffer is empty again. 
      // We pass our function so it automatically resumes writing!
      res.once("drain", writeChunks);
    } else {
      res.end(); // We finished sending everything
      console.log("[Backpressure] Stream complete!");
    }
  }

  // Kick off the writing process
  writeChunks();
});

// 🔥 NEW: Module 7 Cancellation 🔥
app.get("/api/long-task", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  let count = 0;
  
  // 🚨 THE LIFESAVER: This fires the exact millisecond the frontend calls abort()
  req.on('close', () => {
    console.log("🛑 [Module 7] Client ABORTED the connection! Killing the heavy task immediately to save CPU.");
    clearInterval(heavyTask);
  });

  const heavyTask = setInterval(() => {
    count++;
    res.write(`Generating heavy data chunk ${count}...\n`);

    if (count === 15) { // Takes 15 seconds to finish
      clearInterval(heavyTask);
      res.end();
    }
  }, 1000);
});

// 🔥 NEW: Module 8 Server-Sent Events (SSE) 🔥
app.get("/api/events", (req, res) => {
  // 1. Mandatory SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send an event every 1 second
  const interval = setInterval(() => {
    const payload = JSON.stringify({ time: new Date().toLocaleTimeString(), message: "Hello via SSE!" });
    
    // 2. Mandatory SSE Format: Must exactly start with "data: " and end with "\n\n"
    res.write(`data: ${payload}\n\n`);
  }, 1000);

  // Clean up when client disconnects
  req.on("close", () => {
    console.log("🛑 [Module 8] SSE Client disconnected");
    clearInterval(interval);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
