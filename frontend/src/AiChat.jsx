import { useState } from "react";

export default function AiChat() {
  const [chatData, setChatData] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const startAiChat = async () => {
    setChatData(""); // Clear previous chat
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setIsTyping(false);
          break; 
        }
        
        const chunk = decoder.decode(value);
        setChatData((prev) => prev + chunk);
      }
    } catch (error) {
      setChatData(`Error: ${error.message}`);
      setIsTyping(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", marginTop: "30px" }}>
      <h2>Module 3: AI Chat Streaming</h2>
      
      <button 
        onClick={startAiChat} 
        disabled={isTyping}
        style={{ padding: "10px 20px", cursor: isTyping ? "not-allowed" : "pointer" }}
      >
        {isTyping ? "AI is generating..." : "Generate AI Response"}
      </button>
      
      <div style={{ 
        background: "#1e1e1e", 
        color: "#fff",
        padding: "20px", 
        marginTop: "15px",
        minHeight: "120px",
        borderRadius: "8px",
        fontSize: "16px",
        lineHeight: "1.5"
      }}>
        {chatData || <span style={{ color: "#888" }}>Ask the AI something...</span>}
        {isTyping && <span style={{ borderRight: "2px solid white", animation: "blink 1s step-end infinite" }}>&nbsp;</span>}
      </div>
    </div>
  );
}
