// UniAgent Hub - Chat API
import { ChatMessage, ChatChunk } from '@/types';

export async function* streamChat(
  agentId: number,
  message: string,
  history: ChatMessage[],
  token: string
): AsyncGenerator<ChatChunk> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/agents/${agentId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.statusText}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // SSE can split a single event across chunks; keep the trailing line buffered.
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const chunk = JSON.parse(line.slice(6)) as ChatChunk;
          yield chunk;
        } catch {
          console.error('Failed to parse chunk:', line);
        }
      }
    }
  }
}
