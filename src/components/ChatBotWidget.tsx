"use client";

import React, { useState } from "react";
import { Bot, Send, X } from "lucide-react";

export const ChatBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! I’m your AI assistant. Ask me about our services, quotes, or support." },
  ]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const userMessage = { from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Thanks! I’m here to help — tell me more about your IT or digital marketing needs.",
        },
      ]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] rounded-3xl border border-white/10 bg-[#111921]/95 shadow-2xl shadow-slate-950/40 backdrop-blur-xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#0f1720] border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white shadow-lg shadow-[#2563eb]/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Chat Assistant</p>
                <p className="text-xs text-slate-400">Instant help across the site</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-200 transition hover:bg-white/20"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-64 space-y-3 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-950">
            {messages.map((item, index) => (
              <div
                key={`${item.from}-${index}`}
                className={`rounded-3xl px-4 py-3 text-sm leading-6 ${
                  item.from === "bot"
                    ? "bg-slate-900 text-slate-200"
                    : "self-end bg-[#2563eb] text-white"
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
            className="border-t border-white/10 bg-[#0d151c] px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-white/10 bg-[#111921] px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#2563eb] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/30 transition hover:bg-[#1d4ed8]"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-[#2563eb]/25 transition hover:bg-[#1d4ed8]"
      >
        <Bot className="h-5 w-5" />
        Chat with AI
      </button>
    </div>
  );
};
