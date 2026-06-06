import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { ChatMessage, DeepDiveResult } from '../types';
import { getExplanation } from '../services/aiClient';

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  deepDiveResults: DeepDiveResult[];
  openChat: (question: string, topicTitle: string, marks?: string) => void;
  closeChat: () => void;
  sendMessage: (text: string) => void;
  addDeepDiveResult: (r: DeepDiveResult) => void;
  updateDeepDiveResult: (index: number, updates: Partial<DeepDiveResult>) => void;
}

const ChatContext = createContext<ChatState | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deepDiveResults, setDeepDiveResults] = useState<DeepDiveResult[]>([]);
  const contextRef = useRef<string>('');

  const runExplanation = async (history: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const answer = await getExplanation(history, contextRef.current);
      setMessages([...history, { role: 'ai', content: answer }]);
    } catch (e: any) {
      setMessages([
        ...history,
        {
          role: 'ai',
          content: {
            summary: 'Connection error',
            answer_content:
              e?.message ||
              'Sorry, I could not reach the AI tutor. Check that the server has a GEMINI_API_KEY configured.',
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openChat = (question: string, topicTitle: string, marks?: string) => {
    contextRef.current = `Topic: "${topicTitle}". This question is worth ${marks || 'an unspecified number of'} marks. Shape the answer depth to the marks.`;
    const history: ChatMessage[] = [{ role: 'user', content: question }];
    setMessages(history);
    setDeepDiveResults([]);
    setIsOpen(true);
    void runExplanation(history);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const history: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(history);
    void runExplanation(history);
  };

  const closeChat = () => setIsOpen(false);
  const addDeepDiveResult = (r: DeepDiveResult) => setDeepDiveResults((p) => [...p, r]);
  const updateDeepDiveResult = (index: number, updates: Partial<DeepDiveResult>) =>
    setDeepDiveResults((p) => p.map((r, i) => (i === index ? { ...r, ...updates } : r)));

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        deepDiveResults,
        openChat,
        closeChat,
        sendMessage,
        addDeepDiveResult,
        updateDeepDiveResult,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatState => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
};
