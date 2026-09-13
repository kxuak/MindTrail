import type { ChatMessage } from '../types';

interface AIResponse {
  answer?: string;
  error?: string;
}

export const aiService = {
  async sendMessage(
    messages: ChatMessage[],
    userMessage: string
  ): Promise<string> {
    const conversation = [
      ...messages,
      {
        id: Date.now().toString(),
        role: 'user' as const,
        content: userMessage,
        timestamp: new Date(),
      },
    ];

    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        messages: conversation.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      }),
    });

    let data: AIResponse;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        'O servidor retornou uma resposta inválida.'
      );
    }

    if (!response.ok) {
      throw new Error(
        data.error ||
          'Não foi possível obter uma resposta da IA.'
      );
    }

    if (!data.answer) {
      throw new Error(
        'A IA não retornou nenhuma resposta.'
      );
    }

    return data.answer;
  },
};