import { useEffect, useRef, useState } from 'react';
import { Send, Mic, Loader2 } from 'lucide-react';
import { aiService } from '../services/aiService';
import type { ChatMessage } from '../types';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init',
  role: 'assistant',
  content:
    'Olá! Sou o Dev Assistant da HackaApp. 👋\n\nPode me perguntar qualquer coisa sobre programação, estudos ou sobre a trilha.',
  timestamp: new Date(),
};

export function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await aiService.sendMessage(messages, text);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);

      const errorText =
        error instanceof Error
          ? error.message
          : 'Não foi possível conectar com a IA.';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            `⚠️ Não consegui responder.\n\n${errorText}\n\nVerifique se o servidor da IA está rodando.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        .ai-loader {
          --color-one: #a855f7;
          --color-two: #4f46e5;
          --color-three: #c084fc80;
          --color-four: #6366f180;
          --color-five: #a855f740;
          --time-animation: 2s;
          --size: 1.25;
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          transform: scale(var(--size));
          box-shadow:
            0 0 25px 0 var(--color-three),
            0 20px 50px 0 var(--color-four);
          animation: ai-colorize calc(var(--time-animation) * 3) ease-in-out infinite;
        }

        .ai-loader::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border-top: solid 1px var(--color-one);
          border-bottom: solid 1px var(--color-two);
          background: linear-gradient(180deg, var(--color-five), var(--color-four));
          box-shadow:
            inset 0 10px 10px 0 var(--color-three),
            inset 0 -10px 10px 0 var(--color-four);
        }

        .ai-loader .box {
          width: 100px;
          height: 100px;
          background: linear-gradient(180deg, var(--color-one) 30%, var(--color-two) 70%);
          mask: url(#clipping);
          -webkit-mask: url(#clipping);
        }

        .ai-loader svg {
          position: absolute;
          inset: 0;
          width: 100px;
          height: 100px;
        }

        .ai-loader svg #clipping {
          filter: contrast(15);
          animation: ai-roundness calc(var(--time-animation) / 2) linear infinite;
        }

        .ai-loader svg #clipping polygon {
          filter: blur(7px);
        }

        .ai-loader svg #clipping polygon:nth-child(1) {
          transform-origin: 75% 25%;
          transform: rotate(90deg);
        }

        .ai-loader svg #clipping polygon:nth-child(2) {
          transform-origin: 50% 50%;
          animation: ai-rotation var(--time-animation) linear infinite reverse;
        }

        .ai-loader svg #clipping polygon:nth-child(3) {
          transform-origin: 50% 60%;
          animation: ai-rotation var(--time-animation) linear infinite;
          animation-delay: calc(var(--time-animation) / -3);
        }

        .ai-loader svg #clipping polygon:nth-child(4) {
          transform-origin: 40% 40%;
          animation: ai-rotation var(--time-animation) linear infinite reverse;
        }

        .ai-loader svg #clipping polygon:nth-child(5) {
          transform-origin: 40% 40%;
          animation: ai-rotation var(--time-animation) linear infinite reverse;
          animation-delay: calc(var(--time-animation) / -2);
        }

        .ai-loader svg #clipping polygon:nth-child(6) {
          transform-origin: 60% 40%;
          animation: ai-rotation var(--time-animation) linear infinite;
        }

        .ai-loader svg #clipping polygon:nth-child(7) {
          transform-origin: 60% 40%;
          animation: ai-rotation var(--time-animation) linear infinite;
          animation-delay: calc(var(--time-animation) / -1.5);
        }

        @keyframes ai-rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes ai-roundness {
          0% { filter: contrast(15); }
          20% { filter: contrast(3); }
          40% { filter: contrast(3); }
          60% { filter: contrast(15); }
          100% { filter: contrast(15); }
        }

        @keyframes ai-colorize {
          0% { filter: hue-rotate(0deg); }
          20% { filter: hue-rotate(-30deg); }
          40% { filter: hue-rotate(-60deg); }
          60% { filter: hue-rotate(-90deg); }
          80% { filter: hue-rotate(-45deg); }
          100% { filter: hue-rotate(0deg); }
        }

        .ai-floating {
          animation: ai-floating 3s ease-in-out infinite;
        }

        @keyframes ai-floating {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -8px); }
        }

        /* Barra roxa removida: o scroll continua funcionando,
           mas a scrollbar fica completamente invisível. */
        .ai-chat-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .ai-chat-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .ai-chat-scroll::-webkit-scrollbar-track,
        .ai-chat-scroll::-webkit-scrollbar-thumb {
          display: none;
          width: 0;
          height: 0;
        }

        @media (max-width: 640px) {
          .ai-loader {
            --size: 1.05;
          }
        }
      `}</style>

      <div className="absolute inset-0 flex flex-col overflow-hidden">
        <div
          className="
            ai-floating
            absolute
            top-16
            left-1/2
            flex
            items-center
            justify-center
            pointer-events-none
            z-0
          "
        >
          <div className="ai-loader">
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <mask id="clipping">
                  <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                  <polygon points="25,25 75,25 50,75" fill="white" />
                  <polygon points="50,25 75,75 25,75" fill="white" />
                  <polygon points="35,35 65,35 50,65" fill="white" />
                  <polygon points="35,35 65,35 50,65" fill="white" />
                  <polygon points="35,35 65,35 50,65" fill="white" />
                  <polygon points="35,35 65,35 50,65" fill="white" />
                </mask>
              </defs>
            </svg>
            <div className="box" />
          </div>
        </div>

        <div
          className="
            absolute
            top-60
            bottom-32
            left-1/2
            -translate-x-1/2
            w-98
            max-w-[calc(100%-32px)]
            overflow-y-auto
            ai-chat-scroll
            flex
            flex-col
            gap-3
            pointer-events-auto
            z-10
            px-0
            pb-4
          "
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${
                message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`
                  max-w-[92%]
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  leading-relaxed
                  whitespace-pre-wrap
                  shadow-lg
                  ${
                    message.role === 'user'
                      ? 'bg-linear-to-br from-purple-600 to-indigo-600 text-white'
                      : 'bg-surface-2 text-gray-200 border border-purple-500/20'
                  }
                `}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-surface-2 border border-purple-500/20 px-4 py-3 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-purple-400" />
                  <span>A IA está pensando...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-1 shrink-0" />
        </div>

        <div
          className="
            absolute
            bottom-6
            left-0
            right-0
            px-4
            flex
            justify-center
            pointer-events-none
            z-20
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              px-5
              py-2.5
              w-full
              max-w-lg
              pointer-events-auto
              transition-all
            "
            style={{
              background: 'rgba(30, 30, 58, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(124,58,237,0.4)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={
                loading
                  ? 'A IA está pensando...'
                  : 'Pergunte sobre a trilha…'
              }
              className="
                flex-1
                bg-transparent
                text-sm
                text-white
                placeholder-text-muted
                outline-none
                py-1
                disabled:opacity-60
              "
            />

            <button
              type="button"
              className="
                p-2
                rounded-full
                text-text-muted
                hover:text-white
                transition-colors
              "
              title="Microfone"
            >
              <Mic size={18} />
            </button>

            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="
                p-2
                rounded-full
                transition-all
                flex
                items-center
                justify-center
              "
              style={
                input.trim() && !loading
                  ? {
                      background:
                        'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      color: 'white',
                    }
                  : {
                      background:
                        'rgba(124,58,237,0.1)',
                      color: '#4e4d6a',
                      cursor: 'not-allowed',
                    }
              }
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
