const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

// 1. Replace your existing cors middleware (around line 5) with this:
app.use(
  cors({
    origin: "http://localhost:5173", // Specific origin is REQUIRED when using credentials
    credentials: true,               // Crucial: allows browsers to send/receive cookies
  })
);

// 2. Add these routes at the bottom of backend/server.js (before app.listen)
// ----------------------------------------------------
// 🍪 MODULE 1: COOKIE BASICS
// ----------------------------------------------------

// Endpoint to set a cookie
app.get("/api/cookies/set", (req, res) => {
  // Set-Cookie is standard HTTP response header. 
  // We set a cookie named 'user_tracker' with value 'interview_seeker_99'
  res.setHeader("Set-Cookie", "user_tracker=interview_seeker_99; Path=/; SameSite=Lax");
  
  res.json({
    success: true,
    message: "Cookie 'user_tracker' has been set in your browser!",
  });
});

// Endpoint to read the incoming cookies (Manual parsing is a common coding interview task!)
app.get("/api/cookies/get", (req, res) => {
  const rawCookieHeader = req.headers.cookie; // Raw format: "cookie1=val1; cookie2=val2"
  
  console.log("Raw Cookie Header Received:", rawCookieHeader);

  // Manual Cookie Parser (Highly asked in interviews)
  const parsedCookies = {};
  if (rawCookieHeader) {
    rawCookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      const name = parts[0].trim();
      const value = parts.slice(1).join("="); // Handle values containing "="
      parsedCookies[name] = decodeURIComponent(value);
    });
  }

  res.json({
    success: true,
    rawHeader: rawCookieHeader || "No cookies sent",
    parsedCookies: parsedCookies,
  });
});

// Endpoint to clear the cookie
app.get("/api/cookies/clear", (req, res) => {
  // To delete a cookie, the server tells the browser to set its expiration date in the past
  res.setHeader(
    "Set-Cookie",
    "user_tracker=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0"
  );
  
  res.json({
    success: true,
    message: "Cookie 'user_tracker' cleared!",
  });
});
// ----------------------------------------------------
// 🔒 MODULE 2: COOKIE SECURITY ATTRIBUTES
// ----------------------------------------------------

// 1. Unsafe Cookie (No HttpOnly flag - readable by client JavaScript document.cookie)
app.get("/api/cookies/security/unsafe", (req, res) => {
  res.setHeader("Set-Cookie", "cookie_unsafe=hack_me_via_js; Path=/; SameSite=Lax");
  res.json({
    success: true,
    message: "Set unsafe cookie! Check your JavaScript console / document.cookie.",
  });
});

// 2. HttpOnly Cookie (Safe from client-side JavaScript access / XSS scripts)
app.get("/api/cookies/security/httponly", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    "cookie_secure_httponly=hidden_from_js_xss; Path=/; HttpOnly; SameSite=Lax"
  );
  res.json({
    success: true,
    message: "Set HttpOnly cookie! Try reading it via document.cookie—it will not be visible.",
  });
});

// 3. SameSite Strict Cookie (Will not be sent on cross-origin link clicks or forms)
app.get("/api/cookies/security/samesite", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    "cookie_samesite_strict=only_my_domain_requests; Path=/; SameSite=Strict"
  );
  res.json({
    success: true,
    message: "Set SameSite=Strict cookie! This cookie will only be sent on requests originating directly from this site.",
  });
});

// Clear all security demonstration cookies
app.get("/api/cookies/security/clear", (req, res) => {
  res.setHeader("Set-Cookie", [
    "cookie_unsafe=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "cookie_secure_httponly=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly",
    "cookie_samesite_strict=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  ]);
  res.json({
    success: true,
    message: "All security demonstration cookies cleared!",
  });
});

// ----------------------------------------------------
// 🕒 MODULE 3: COOKIE LIFESPANS & SCOPING
// ----------------------------------------------------

// A. Set a Session Cookie (Stored in RAM, deleted when browser/tab closes)
app.get("/api/cookies/lifespan/session", (req, res) => {
  // Notice we omit Expires and Max-Age
  res.setHeader("Set-Cookie", "cookie_session=i_live_in_ram; Path=/; SameSite=Lax");
  res.json({
    success: true,
    message: "Set Session Cookie (RAM storage). Check your Application Tab!",
  });
});

// B. Set a Persistent Cookie using Max-Age (Expires relatively in 60 seconds)
app.get("/api/cookies/lifespan/persistent", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    "cookie_persistent=i_live_on_disk_60s; Max-Age=60; Path=/; SameSite=Lax"
  );
  res.json({
    success: true,
    message: "Set Persistent Cookie using Max-Age (Expires in 60s).",
  });
});

// C. Set a Persistent Cookie using Expires (Expires absolutely in 2 minutes)
app.get("/api/cookies/lifespan/expires", (req, res) => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 2); // 2 minutes from now
  const expiresGMTString = expiryDate.toUTCString();  // absolute RFC 1123 format

  res.setHeader(
    "Set-Cookie",
    `cookie_expires=i_use_absolute_time; Expires=${expiresGMTString}; Path=/; SameSite=Lax`
  );
  res.json({
    success: true,
    message: `Set Persistent Cookie using Expires attribute. Expiration: ${expiresGMTString}`,
  });
});

// D. Set a Path-Scoped Cookie (Only sent to matching subpaths)
app.get("/api/cookies/lifespan/path-scoped", (req, res) => {
  // Restricting path to '/api/cookies/lifespan/special'
  res.setHeader(
    "Set-Cookie",
    "cookie_path_scoped=restricted_access; Path=/api/cookies/lifespan/special; SameSite=Lax"
  );
  res.json({
    success: true,
    message: "Set Path-Scoped Cookie! Bound strictly to path: /api/cookies/lifespan/special",
  });
});

// E. Special endpoint inside the scoped path to verify cookie receipt
app.get("/api/cookies/lifespan/special/test", (req, res) => {
  res.json({
    success: true,
    message: "Requested /api/cookies/lifespan/special/test",
    cookiesReceived: req.headers.cookie || "No cookies received at this path",
  });
});

// F. Clear Module 3 demonstration cookies
app.get("/api/cookies/lifespan/clear", (req, res) => {
  res.setHeader("Set-Cookie", [
    "cookie_session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "cookie_persistent=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "cookie_expires=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "cookie_path_scoped=; Path=/api/cookies/lifespan/special; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  ]);
  res.json({
    success: true,
    message: "Module 3 cookies cleared!",
  });
});

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
