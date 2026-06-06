import React, { useEffect, useRef, useState } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useChat } from '../store';
import { DeepDiveMode } from '../types';
import { AnswerView } from './AnswerView';
import { Markdown } from './Markdown';
import { TextSelectionMenu } from './TextSelectionMenu';
import { DeepDiveCard } from './DeepDiveCard';
import { generateDeepDive } from '../services/aiClient';

export const ChatModal: React.FC = () => {
  const {
    isOpen,
    messages,
    isLoading,
    deepDiveResults,
    closeChat,
    sendMessage,
    addDeepDiveResult,
    updateDeepDiveResult,
  } = useChat();
  const [input, setInput] = useState('');
  const [ddLoading, setDdLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, deepDiveResults, isLoading, ddLoading]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleDeepDive = async (text: string, mode: DeepDiveMode) => {
    setDdLoading(true);
    try {
      const r = await generateDeepDive(text, mode);
      addDeepDiveResult({ ...r, sourceText: text });
    } catch {
      addDeepDiveResult({ explanation: 'Could not generate a deep dive. Please try again.' });
    } finally {
      setDdLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">AI Professor</h3>
              <p className="text-xs text-slate-500">Mark-aware, step-by-step solutions</p>
            </div>
          </div>
          <button onClick={closeChat} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
            <X size={22} />
          </button>
        </div>

        {/* Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-50/30 relative">
          <TextSelectionMenu containerRef={scrollRef as React.RefObject<HTMLElement>} onDeepDive={handleDeepDive} />

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                  m.role === 'user' ? 'bg-slate-200' : 'bg-indigo-600'
                }`}
              >
                {m.role === 'user' ? <User size={20} className="text-slate-600" /> : <Bot size={20} className="text-white" />}
              </div>
              <div
                className={`max-w-[90%] rounded-2xl p-6 shadow-sm ${
                  m.role === 'user' ? 'bg-slate-100 text-slate-800' : 'bg-white border border-slate-100'
                }`}
              >
                {m.role === 'ai' && typeof m.content !== 'string' ? (
                  <AnswerView answer={m.content} />
                ) : (
                  <Markdown>{m.content as string}</Markdown>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                <Bot size={20} className="text-white" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-sm flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                <span className="text-slate-600 font-medium">Generating step-by-step solution…</span>
              </div>
            </div>
          )}

          {deepDiveResults.map((r, i) => (
            <div key={`dd-${i}`} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex-1 max-w-[90%]">
                <DeepDiveCard result={r} onUpdate={(u) => updateDeepDiveResult(i, u)} />
              </div>
            </div>
          ))}

          {ddLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex-1 max-w-[90%]">
                <DeepDiveCard result={{ explanation: '' }} isLoading />
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t border-slate-100 bg-white">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a follow-up question…  (tip: highlight any text for a Deep Dive)"
              className="flex-1 border border-slate-200 rounded-xl px-5 py-3.5 text-base bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 text-white px-6 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 font-semibold"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
