"use client";

import { useState, useRef, useEffect } from "react";
import { ConversationPanelProps } from "../types/daviz.types";

export default function ConversationPanel({
  messages,
  onSendMessage,
  loading,
  className = "",
}: ConversationPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div 
      className={`
        flex flex-col h-full 
        bg-white/80 backdrop-blur-xl 
        rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        border border-white/20 ring-1 ring-slate-900/5 
        overflow-hidden ${className}
      `}
      style={{ padding: '10' }}
    >
      
      {/* Glass Header */}
      <div className="border-b border-slate-100/60 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10" style={{ padding: '20px 24px' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">AI Analyst</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 scroll-smooth bg-slate-50/30" style={{ padding: '20px' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-60">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-slate-100 rounded-2xl flex items-center justify-center shadow-sm border border-white">
              <span className="text-4xl">👋</span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-700">No messages yet</p>
              <p className="text-xs text-slate-500">Ask about your data to get started</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full group ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex max-w-[85%] gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm text-[10px] font-bold ring-2 ring-white ${
                  message.role === "user" 
                    ? "bg-slate-800 text-white" 
                    : "bg-indigo-100 text-indigo-600"
                }`}>
                  {message.role === "user" ? "ME" : "AI"}
                </div>

                {/* Bubble */}
                <div className={`relative shadow-sm text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-slate-800 text-white rounded-2xl rounded-tr-sm"
                    : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm shadow-[0_2px_8px_rgb(0,0,0,0.04)]"
                }`} style={{ padding: '14px 20px' }}>
                  {message.content}
                  {message.error && (
                    <div className="mt-2 text-xs text-red-500 bg-red-50 rounded border border-red-100" style={{ padding: '8px' }}>
                      Error: {message.error}
                    </div>
                  )}
                  <span className={`text-[10px] absolute -bottom-5 ${message.role === 'user' ? 'right-1' : 'left-1'} text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 ml-11" style={{ padding: '12px 16px' }}>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-md border-t border-slate-100" style={{ padding: '16px' }}>
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your data..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-700 placeholder:text-slate-400 shadow-inner"
            style={{ padding: '16px 20px', paddingRight: '56px' }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 transform -rotate-45 ml-0.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}