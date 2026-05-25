// UniAgent Hub - Agent Chat Hook
import { useState, useCallback } from 'react';
import { streamChat } from '@/api/chat.api';
import { ChatMessage } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export function useAgentChat(agentId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const token = useAuthStore((state) => state.token);

  const sendMessage = useCallback(async (content: string) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentResponse('');

    try {
      let assistantContent = '';
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      for await (const chunk of streamChat(agentId, content, messages, token)) {
        if (chunk.type === 'content' && chunk.content) {
          assistantContent += chunk.content;
          setCurrentResponse(assistantContent);
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: assistantContent }
                : msg
            )
          );
        }
      }

      setCurrentResponse('');
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => prev.filter((msg) => msg.role !== 'assistant' || msg.content !== ''));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [agentId, token, messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentResponse('');
  }, []);

  return {
    messages,
    isLoading,
    currentResponse,
    sendMessage,
    clearChat,
  };
}
