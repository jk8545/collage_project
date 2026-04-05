"use client";

import React, { useState, useRef, useEffect } from "react";
import { getApiUrl } from "@/lib/api-config";

export default function DuckChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: "assistant", content: "Quack! I'm NutriDuck 🦆 — your AI nutrition buddy. Ask me anything about your scanned product or just chat!" }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const storedResult = localStorage.getItem('nutrivision_result');
      const context = storedResult ? JSON.parse(storedResult) : null;

      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${getApiUrl()}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, history, context })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Chat failed");

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Quack... my circuits are glitching (Error reaching backend)." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 h-96 bg-nv-bg-800 border border-[rgba(34,197,94,0.25)] shadow-[0_0_15px_rgba(34,197,94,0.15)] rounded-[20px] flex flex-col overflow-hidden animate-fade-in-up font-dm text-nv-t1">
          <div className="bg-nv-bg-700 border-b border-[rgba(34,197,94,0.25)] p-3 flex justify-between items-center">
            <h3 className="font-bold text-nv-green flex items-center gap-2 font-syne text-lg">
               NutriDuck
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-nv-t3 hover:text-nv-neon text-xl leading-none">&times;</button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 px-3 rounded-xl max-w-[85%] text-sm font-medium ${
                  m.role === 'user' ? 'bg-nv-green text-nv-bg-900 rounded-tr-sm shadow-md shadow-nv-green/10' 
                  : 'bg-nv-bg-600 border border-nv-b1 text-nv-t2 rounded-tl-sm shadow-inner'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-nv-bg-600 border border-nv-b1 p-2 px-3 rounded-xl rounded-tl-sm flex gap-1 shadow-inner">
                  <div className="w-2 h-2 bg-nv-green-light rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-nv-green-light rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-nv-green-light rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-nv-bg-800 border-t border-[rgba(34,197,94,0.25)] flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..." 
              className="flex-1 bg-nv-bg-700 border border-nv-b2 rounded-lg px-3 py-1.5 text-sm text-nv-t1 focus:outline-none focus:border-nv-green transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-nv-green text-nv-bg-900 font-syne font-bold border border-nv-green-light rounded-lg px-4 hover:bg-nv-neon transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-nv-green border-2 border-[rgba(34,197,94,0.15)] hover:border-nv-neon text-3xl rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center hover:scale-110 transition-all focus:outline-none"
      >
        🦆
      </button>
    </div>
  );
}
