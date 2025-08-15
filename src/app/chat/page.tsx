"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const personaDetails: Record<string, { name: string; image: string }> = {
  hiteshPersona: { name: "Hitesh Choudhary", image: "/hitesh.png" },
  piyushPersona: { name: "Piyush Garg", image: "/piyush.webp" },
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const personaKey = (searchParams.get("persona") || "hiteshPersona") as keyof typeof personaDetails;
  const currentPersona = personaDetails[personaKey] || personaDetails.hiteshPersona;
  
  const [loading, setLoading] = useState(false); // Loading state
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: `Hello! I am ${currentPersona.name}. How can I help you today?` },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]); // Added loading to the dependency array

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true); // Set loading to true before the API call

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: personaKey,
          messages: [...messages, userMessage].map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      
      const data = await res.json();
      if (data && data.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I received an invalid response." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false); // Always set loading to false after the API call finishes
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center p-4">
      <div className="flex flex-col w-full md:max-w-4xl lg:max-w-5xl 2xl:max-w-6xl h-[90vh] bg-gray-900/90 backdrop-blur-md text-white rounded-2xl shadow-xl overflow-hidden border border-gray-800">
        
        {/* Persona Header */}
        <div className="flex items-center p-4 border-b border-gray-700 bg-gray-900/70">
          <img src={currentPersona.image} alt={currentPersona.name} className="w-12 h-12 rounded-full mr-3" />
          <h2 className="text-lg font-semibold">{currentPersona.name}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-3 w-fit max-w-[80%] rounded-lg break-words whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.sender === "bot" && (
                <span className="block text-xs opacity-70 mb-1">{currentPersona.name}</span>
              )}
              {msg.text}
            </motion.div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center p-3">
                <span className="text-gray-400">Thinking...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 flex items-end gap-2 bg-gray-900/70">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 160) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-lg p-3 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500 max-h-40 overflow-y-auto"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-500 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}