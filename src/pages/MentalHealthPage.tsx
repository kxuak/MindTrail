import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  HeartPulse,
  Send,
  Loader2,
  ChevronRight,
  Phone,
  ShieldCheck,
  Stethoscope,
  ExternalLink,
} from 'lucide-react';

import type { ChatMessage } from '../types';

const positiveResponses = [
  'Que bom saber que você está se sentindo bem. Aproveite esse momento e continue cuidando de você. 💚',
  'Fico feliz por você. Pequenos hábitos de cuidado também fazem diferença no dia a dia. 🌱',
  'Que ótimo! Mesmo nos dias bons, cuidar da saúde emocional continua sendo importante. 💜',
];

const ratingLabels: Record<number, string> = {
  1: 'Muito mal',
  2: 'Muito mal',
  3: 'Mal',
  4: 'Abaixo da média',
  5: 'Regular',
  6: 'Na média',
  7: 'Bem',
  8: 'Muito bem',
  9: 'Ótimo',
  10: 'Excelente',
};

type Phase = 'checkin' | 'positive' | 'chat';

type Resource = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  phone?: string;
  accent: string;
};

const resources: Resource[] = [
  {
    title: 'Pode Falar',
    description:
      'Escuta e orientação gratuita para jovens de 13 a 24 anos.',
    icon: <HeartPulse size={18} />,
    href: 'https://www.podefalar.org.br/',
    accent: '#ec4899',
  },
  {
    title: 'Encontrar psicólogo',
    description:
      'Consulte o Cadastro Nacional de Profissionais de Psicologia.',
    icon: <Stethoscope size={18} />,
    href: 'https://cadastro.cfp.org.br/',
    accent: '#8b5cf6',
  },
  {
    title: 'CAPS / CAPS i',
    description:
      'Atendimento em saúde mental pelo SUS. O CAPS i atende crianças e adolescentes.',
    icon: <ShieldCheck size={18} />,
    accent: '#06b6d4',
  },
  {
    title: 'CVV 188',
    description:
      'Apoio emocional gratuito, 24 horas por dia.',
    icon: <Phone size={18} />,
    phone: '188',
    accent: '#10b981',
  },
];

function isCrisisMessage(text: string) {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const crisisTerms = [
    'quero me matar',
    'vou me matar',
    'me matar',
    'suicidio',
    'suicidar',
    'tirar minha vida',
    'acabar com minha vida',
    'nao quero viver',
    'me cortar',
    'me machucar',
    'autolesao',
    'me ferir',
    'overdose',
  ];

  return crisisTerms.some((term) =>
    normalized.includes(
      term
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    )
  );
}

function buildCrisisMessage(): string {
  return `Sinto muito que você esteja passando por isso. 💜

O que você está sentindo merece atenção de uma pessoa real e, neste momento, é importante não ficar sozinho(a).

Se existe risco de você se machucar ou de alguém te machucar agora:

• Ligue para o **SAMU 192** ou procure uma **UPA, pronto-socorro ou hospital**.
• Ligue para o **CVV 188**, que oferece apoio emocional gratuitamente 24 horas.
• Chame um adulto de confiança — responsável, familiar, professor, orientador ou outro adulto que possa ficar com você.
• Afaste-se de objetos, medicamentos ou outros meios que você poderia usar para se machucar e fique perto de outras pessoas.

Eu posso continuar conversando com você aqui, mas não substituo atendimento profissional.`;
}

async function getMentalHealthResponse(
  messages: ChatMessage[],
  userMessage: string
): Promise<string> {
  if (isCrisisMessage(userMessage)) {
    return buildCrisisMessage();
  }

  const conversation = [
    ...messages,
    {
      id: Date.now().toString(),
      role: 'user' as const,
      content: userMessage,
      timestamp: new Date(),
    },
  ];

  const response = await fetch(
    'http://localhost:3001/api/mental-health',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: conversation.map(
          (message) => ({
            role: message.role,
            content: message.content,
          })
        ),
      }),
    }
  );

  const responseText = await response.text();

  let data: {
    answer?: string;
    error?: string;
  };

  try {
    data = JSON.parse(responseText);
  } catch {
    console.error(
      'Resposta bruta do servidor:',
      responseText
    );

    throw new Error(
      `O servidor retornou uma resposta inválida (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
        'Não foi possível obter uma resposta.'
    );
  }

  if (!data.answer) {
    throw new Error(
      'A IA não retornou nenhuma resposta.'
    );
  }

  return data.answer;
}

export function MentalHealthPage() {
  const [phase, setPhase] =
    useState<Phase>('checkin');

  const [rating, setRating] =
    useState<number | null>(null);

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [input, setInput] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [showResources, setShowResources] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, loading]);

  const handleRatingSelect = (value: number) => {
    setRating(value);

    if (value < 6) {
      const opener: ChatMessage = {
        id: 'opener',
        role: 'assistant',
        content:
          `Percebi que hoje você se avaliou em ${value}/10. 💜\n\nObrigado por me contar. Estou aqui para ouvir sem julgamentos. Quer me contar um pouco sobre como você está se sentindo ou o que está acontecendo?`,
        timestamp: new Date(),
      };

      setMessages([opener]);
      setPhase('chat');
      return;
    }

    setPhase('positive');
  };

  const sendMessage = async () => {
    const text = input.trim();

    if (!text || loading) {
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
    ]);

    setInput('');
    setLoading(true);

    try {
      const reply =
        await getMentalHealthResponse(
          messages,
          text
        );

      const assistantMsg: ChatMessage = {
        id: (
          Date.now() + 1
        ).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [
        ...prev,
        assistantMsg,
      ]);
    } catch (error) {
      console.error(
        'Erro na saúde mental:',
        error
      );

      const errorText =
        error instanceof Error
          ? error.message
          : 'Não foi possível conectar com a IA.';

      setMessages((prev) => [
        ...prev,
        {
          id: (
            Date.now() + 1
          ).toString(),
          role: 'assistant',
          content:
            `⚠️ Não consegui responder agora.\n\n${errorText}\n\nSe estiver precisando de ajuda imediata, procure um adulto de confiança ou use os contatos de apoio disponíveis nesta página.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const selectedRatingLabel =
    rating
      ? ratingLabels[rating]
      : null;

  const mentalHealthStyles = `
    .mental-heart-main {
      position: relative;
      width: 70px;
      height: 70px;
      background: #f20044;
      transform: rotate(-45deg);
      box-shadow: -10px -10px 90px #f20044;
      animation: mental-heart-anim 0.6s linear infinite;
    }

    .mental-heart-main::before {
      content: "";
      position: absolute;
      width: 70px;
      height: 70px;
      background: #f20044;
      top: -50%;
      border-radius: 50px;
    }

    .mental-heart-main::after {
      content: "";
      position: absolute;
      width: 70px;
      height: 70px;
      background: #f20044;
      right: -50%;
      border-radius: 50px;
    }

    @keyframes mental-heart-anim {
      0% {
        transform: rotate(-45deg) scale(1.07);
        filter: blur(0px);
      }

      80% {
        transform: rotate(-45deg) scale(1);
        filter: blur(1px);
      }

      100% {
        transform: rotate(-45deg) scale(0.8);
        filter: blur(2px);
      }
    }

    .mental-rating {
      display: flex;
      flex-direction: row-reverse;
      justify-content: center;
      align-items: center;
      gap: 8px;
      width: 100%;
      margin: 10px auto 0;
    }

    .mental-rating > input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .mental-rating > label {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 50px;
      margin: 0;
      flex-shrink: 0;
    }

    .mental-rating > label > svg {
      width: 36px;
      height: 36px;
      fill: #44445a;
      transition:
        fill 0.3s ease,
        transform 0.3s ease,
        filter 0.3s ease;
    }

    .mental-rating
      > input:checked
      ~ label
      > svg {
      transform: scale(1.1);
    }

    #heart1:checked ~ label > svg,
    #heart2:checked ~ label > svg,
    #heart3:checked ~ label > svg,
    #heart4:checked ~ label > svg,
    #heart5:checked ~ label > svg {
      fill: #ff0000;
    }

    #heart6:checked ~ label > svg {
      fill: #00ff4d;
    }

    #heart7:checked ~ label > svg {
      fill: #00ff99;
    }

    #heart8:checked ~ label > svg {
      fill: #00ccff;
    }

    #heart9:checked ~ label > svg {
      fill: #0059ff;
    }

    #heart10:checked ~ label > svg {
      fill: #9900ff;
    }

    .mental-rating
      > label:hover
      > svg,
    .mental-rating
      > label:hover
      ~ label
      > svg {
      transform: scale(1.05);
    }

    .mental-rating
      > label:nth-of-type(1):hover
      > svg,
    .mental-rating
      > label:nth-of-type(1):hover
      ~ label
      > svg {
      fill: #e60000;
    }

    .mental-rating
      > label:nth-of-type(2):hover
      > svg,
    .mental-rating
      > label:nth-of-type(2):hover
      ~ label
      > svg {
      fill: #e66a00;
    }

    .mental-rating
      > label:nth-of-type(3):hover
      > svg,
    .mental-rating
      > label:nth-of-type(3):hover
      ~ label
      > svg {
      fill: #e6b600;
    }

    .mental-rating
      > label:nth-of-type(4):hover
      > svg,
    .mental-rating
      > label:nth-of-type(4):hover
      ~ label
      > svg {
      fill: #a6e600;
    }

    .mental-rating
      > label:nth-of-type(5):hover
      > svg,
    .mental-rating
      > label:nth-of-type(5):hover
      ~ label
      > svg {
      fill: #00e600;
    }

    .mental-rating
      > label:nth-of-type(6):hover
      > svg,
    .mental-rating
      > label:nth-of-type(6):hover
      ~ label
      > svg {
      fill: #00b3e6;
    }

    .mental-rating
      > label:nth-of-type(7):hover
      > svg,
    .mental-rating
      > label:nth-of-type(7):hover
      ~ label
      > svg {
      fill: #00e6b3;
    }

    .mental-rating
      > label:nth-of-type(8):hover
      > svg,
    .mental-rating
      > label:nth-of-type(8):hover
      ~ label
      > svg {
      fill: #00e6e6;
    }

    .mental-rating
      > label:nth-of-type(9):hover
      > svg,
    .mental-rating
      > label:nth-of-type(9):hover
      ~ label
      > svg {
      fill: #0066e6;
    }

    .mental-rating
      > label:nth-of-type(10):hover
      > svg,
    .mental-rating
      > label:nth-of-type(10):hover
      ~ label
      > svg {
      fill: #6600e6;
    }

    .mental-rating-hint {
      text-align: center;
      color: #8b8aaa;
      font-size: 12px;
      margin-top: 16px;
      min-height: 18px;
    }

    .mental-rating-note {
      color: #5e5d7a;
      font-size: 11px;
      text-align: center;
      margin-top: 6px;
    }

    .mental-heart-mini-wrapper {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: visible;
    }

    .mental-heart-mini {
      position: relative;
      width: 15px;
      height: 15px;
      background: #f20044;
      transform: rotate(-45deg);
      box-shadow: -3px -3px 18px #f20044;
      animation: mental-heart-mini-anim 0.7s linear infinite;
    }

    .mental-heart-mini::before {
      content: "";
      position: absolute;
      width: 15px;
      height: 15px;
      background: #f20044;
      top: -50%;
      border-radius: 50px;
    }

    .mental-heart-mini::after {
      content: "";
      position: absolute;
      width: 15px;
      height: 15px;
      background: #f20044;
      right: -50%;
      border-radius: 50px;
    }

    @keyframes mental-heart-mini-anim {
      0% {
        transform: rotate(-45deg) scale(1.07);
        filter: blur(0px);
      }

      80% {
        transform: rotate(-45deg) scale(1);
        filter: blur(0.5px);
      }

      100% {
        transform: rotate(-45deg) scale(0.8);
        filter: blur(1px);
      }
    }

    @media (max-width: 640px) {
      .mental-rating {
        gap: 1px;
      }

      .mental-rating > label {
        width: 28px;
      }

      .mental-rating > label > svg {
        width: 25px;
        height: 25px;
      }

      .mental-rating-card {
        padding: 20px !important;
        min-height: 220px !important;
      }
    }
  `;

 

  if (phase === 'checkin') {
    return (
      <>
        <style>{mentalHealthStyles}</style>

        <div
          className="
            flex-1
            overflow-y-auto
            pb-24
            px-5
          "
        >
          <div
            className="
              pt-12
              pb-8
              text-center
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                mb-2
              "
            >
              <HeartPulse
                size={24}
                className="text-pink-400"
              />

              <h1
                className="
                  font-['Outfit']
                  text-3xl
                  font-bold
                  text-white
                "
              >
                Saúde Mental
              </h1>
            </div>

            <p className="text-sm text-[#8b8aaa]">
              Um espaço de apoio para você
            </p>
          </div>

          <div
            className="
              flex
              flex-col
              items-center
              mb-8
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                mb-8
              "
              style={{
                width: '110px',
                height: '110px',
              }}
            >
              <div className="mental-heart-main" />
            </div>

            <h2
              className="
                font-['Outfit']
                text-xl
                font-bold
                text-white
                text-center
              "
            >
              Como você está se sentindo hoje?
            </h2>

            <p
              className="
                text-sm
                text-[#8b8aaa]
                text-center
                mt-2
                max-w-lg
              "
            >
              Avalie seu bem-estar de 1 a 10.
              Se sua avaliação ficar abaixo da
              média, você poderá conversar com
              nosso assistente de apoio emocional.
            </p>
          </div>

          <div
            className="
              w-full
              max-w-3xl
              mx-auto
              mb-6
            "
          >
            <div
              className="
                mental-rating-card
                w-full
                min-h-[260px]
                rounded-2xl
                p-8
                flex
                flex-col
                items-center
                justify-center
              "
              style={{
                background:
                  'rgba(20,20,42,0.78)',
                border:
                  '1px solid rgba(124,58,237,0.22)',
                boxShadow:
                  '0 12px 35px rgba(0,0,0,0.18)',
              }}
            >
              <p
                className="
                  text-sm
                  text-[#aaa8c7]
                  text-center
                  mb-2
                "
              >
                Toque em um coração para avaliar
              </p>

              <div
                className="mental-rating"
                role="radiogroup"
                aria-label="Avaliação de bem-estar de 1 a 10"
              >
                {Array.from(
                  { length: 10 },
                  (_, index) => 10 - index
                ).map((value) => (
                  <React.Fragment
                    key={value}
                  >
                    <input
                      type="radio"
                      id={`heart${value}`}
                      name="rate"
                      value={value}
                      checked={
                        rating === value
                      }
                      onChange={() =>
                        handleRatingSelect(
                          value
                        )
                      }
                    />

                    <label
                      htmlFor={`heart${value}`}
                      title={
                        ratingLabels[value]
                      }
                      aria-label={`${value} de 10 — ${ratingLabels[value]}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </label>
                  </React.Fragment>
                ))}
              </div>

              <div className="mental-rating-hint">
                {selectedRatingLabel
                  ? `${rating}/10 — ${selectedRatingLabel}`
                  : '1 = muito mal  •  10 = excelente'}
              </div>

              <div className="mental-rating-note">
                Avaliação abaixo de 6 abre o
                apoio emocional com a IA.
              </div>
            </div>
          </div>


          <div
            className="
              max-w-xl
              mx-auto
              flex
              flex-col
              gap-3
            "
          >
            <div
              className="
                p-4
                rounded-2xl
              "
              style={{
                background:
                  '#14142a',
                border:
                  '1px solid #2a2a4a',
              }}
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <span className="text-xl">
                  💡
                </span>

                <p
                  className="
                    text-xs
                    text-[#8b8aaa]
                    leading-relaxed
                  "
                >
                  <span className="text-white font-semibold">
                    Cuidar da mente também é
                    cuidado.
                  </span>{' '}
                  Você pode conversar com alguém
                  de confiança e buscar apoio
                  profissional quando precisar.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowResources(
                  (current) =>
                    !current
                )
              }
              className="
                p-4
                rounded-2xl
                flex
                items-center
                justify-between
                text-left
              "
              style={{
                background:
                  'rgba(236,72,153,0.08)',
                border:
                  '1px solid rgba(236,72,153,0.2)',
              }}
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <ShieldCheck
                  size={20}
                  className="text-pink-400"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Precisa de ajuda ou quer
                    encontrar um profissional?
                  </p>

                  <p className="text-xs text-[#8b8aaa] mt-1">
                    Veja opções gratuitas e
                    caminhos para encontrar
                    psicólogos.
                  </p>
                </div>
              </div>

              <ChevronRight
                size={18}
                className="text-pink-400"
              />
            </button>

            {showResources && (
              <div
                className="
                  flex
                  flex-col
                  gap-2
                "
              >
                {resources.map(
                  (resource) => (
                    <ResourceButton
                      key={resource.title}
                      resource={resource}
                    />
                  )
                )}
              </div>
            )}

            <div
              className="
                p-4
                rounded-2xl
              "
              style={{
                background:
                  'rgba(16,185,129,0.07)',
                border:
                  '1px solid rgba(16,185,129,0.18)',
              }}
            >
              <p
                className="
                  text-xs
                  text-[#a8aac0]
                  leading-relaxed
                "
              >
                🆘 Em uma situação de emergência
                ou risco de se machucar, procure
                ajuda imediata. O{' '}
                <strong className="text-white">
                  SAMU 192
                </strong>{' '}
                atende urgências, e o{' '}
                <strong className="text-white">
                  CVV 188
                </strong>{' '}
                oferece apoio emocional 24 horas.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     POSITIVO
  ========================================================== */

  if (phase === 'positive') {
    const response =
      positiveResponses[
        Math.floor(
          Math.random() *
            positiveResponses.length
        )
      ];

    return (
      <>
        <style>{mentalHealthStyles}</style>

        <div
          className="
            flex-1
            overflow-y-auto
            pb-24
            px-5
          "
        >
          <div className="pt-12 pb-6 text-center">
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <HeartPulse
                size={22}
                className="text-pink-400"
              />

              <h1
                className="
                  font-['Outfit']
                  text-2xl
                  font-bold
                  text-white
                "
              >
                Saúde Mental
              </h1>
            </div>
          </div>

          <div
            className="
              max-w-xl
              mx-auto
              flex
              flex-col
              items-center
              text-center
            "
          >
            <div
              className="
                text-5xl
                font-['Outfit']
                font-bold
                text-white
                mb-2
              "
            >
              {rating}/10
            </div>

            <div className="text-4xl mb-3">
              ❤️
            </div>

            <h2
              className="
                font-['Outfit']
                text-xl
                font-bold
                text-white
                mb-3
              "
            >
              {ratingLabels[rating ?? 6]}
            </h2>

            <div
              className="
                rounded-2xl
                p-5
                text-left
                w-full
              "
              style={{
                background:
                  'rgba(16,185,129,0.08)',
                border:
                  '1px solid rgba(16,185,129,0.3)',
              }}
            >
              <p
                className="
                  text-sm
                  text-[#c4b5fd]
                  leading-relaxed
                "
              >
                {response}
              </p>
            </div>
          </div>

          <div
            className="
              max-w-xl
              mx-auto
              mt-8
            "
          >
            <p
              className="
                text-xs
                text-[#8b8aaa]
                font-semibold
                uppercase
                tracking-wider
                mb-3
              "
            >
              Dicas de bem-estar
            </p>

            <div
              className="
                flex
                flex-col
                gap-2
              "
            >
              {[
                {
                  emoji: '😴',
                  tip: 'Tenha uma rotina de sono consistente e suficiente para a sua idade.',
                },
                {
                  emoji: '🚶',
                  tip: 'Movimente o corpo e faça pausas durante o dia.',
                },
                {
                  emoji: '💬',
                  tip: 'Converse com alguém de confiança quando algo estiver pesando.',
                },
                {
                  emoji: '📵',
                  tip: 'Reserve momentos longe das telas para descansar.',
                },
              ].map(
                ({
                  emoji,
                  tip,
                }) => (
                  <div
                    key={tip}
                    className="
                      flex
                      items-start
                      gap-3
                      p-3
                      rounded-xl
                    "
                    style={{
                      background:
                        '#14142a',
                      border:
                        '1px solid #2a2a4a',
                    }}
                  >
                    <span className="text-xl">
                      {emoji}
                    </span>

                    <p className="text-sm text-[#8b8aaa]">
                      {tip}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() =>
                  setPhase('checkin')
                }
                className="
                  w-full
                  py-3.5
                  rounded-2xl
                  font-['Outfit']
                  font-semibold
                  text-white
                "
                style={{
                  background:
                    'linear-gradient(135deg, #7c3aed, #5b21b6)',
                }}
              >
                Fazer nova avaliação
              </button>

              <button
                type="button"
                onClick={() => {
                  const opener: ChatMessage = {
                    id: 'positive-chat-opener',
                    role: 'assistant',
                    content:
                      'Mesmo estando bem, você também pode conversar comigo. 😊 Sobre o que você gostaria de falar?',
                    timestamp: new Date(),
                  };

                  setMessages([opener]);
                  setPhase('chat');
                }}
                className="
                  w-full
                  py-3
                  rounded-2xl
                  font-semibold
                  text-violet-300
                "
                style={{
                  background:
                    'rgba(124,58,237,0.08)',
                  border:
                    '1px solid rgba(124,58,237,0.2)',
                }}
              >
                Quero conversar mesmo assim
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     CHAT
  ========================================================== */

  return (
    <>
      <style>{mentalHealthStyles}</style>

      <div className="flex flex-col h-full">
        <div
          className="
            flex-shrink-0
            px-5
            pt-10
            pb-4
          "
          style={{
            background:
              'linear-gradient(to bottom, #0b0b18 70%, transparent)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-12
                h-12
                rounded-2xl
                flex
                items-center
                justify-center
              "
              style={{
                background:
                  'rgba(236,72,153,0.08)',
              }}
            >
              <div className="mental-heart-mini-wrapper">
                <div className="mental-heart-mini" />
              </div>
            </div>

            <div>
              <h1
                className="
                  font-['Outfit']
                  font-bold
                  text-white
                "
              >
                Apoio Emocional
              </h1>

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >
                <span
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-pink-400
                    animate-pulse
                  "
                />

                <span className="text-xs text-[#8b8aaa]">
                  Assistente de apoio
                </span>
              </div>
            </div>

            {rating && (
              <div
                className="
                  ml-auto
                  text-xs
                  text-pink-300
                  font-semibold
                "
              >
                {rating}/10
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setShowResources(
                (current) =>
                  !current
              )
            }
            className="
              mt-3
              w-full
              flex
              items-center
              justify-between
              p-3
              rounded-xl
            "
            style={{
              background:
                'rgba(236,72,153,0.08)',
              border:
                '1px solid rgba(236,72,153,0.2)',
            }}
          >
            <span
              className="
                text-sm
                text-pink-300
                font-semibold
              "
            >
              Encontrar ajuda profissional
            </span>

            <ChevronRight
              size={16}
              className="text-pink-400"
            />
          </button>

          {showResources && (
            <div
              className="
                mt-2
                flex
                flex-col
                gap-2
              "
            >
              {resources.map(
                (resource) => (
                  <ResourceButton
                    key={resource.title}
                    resource={resource}
                  />
                )
              )}
            </div>
          )}
        </div>

        <div
          className="
            flex-1
            overflow-y-auto
            px-4
            py-2
            space-y-3
          "
          style={{
            paddingBottom: '6rem',
            minHeight: 0,
          }}
        >
          {messages.map(
            (message) => {
              const isUser =
                message.role === 'user';

              return (
                <div
                  key={message.id}
                  className={`
                    flex
                    ${
                      isUser
                        ? 'justify-end'
                        : 'justify-start'
                    }
                    gap-2
                  `}
                >
                  {!isUser && (
                    <div
                      className="
                        w-8
                        h-8
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                      style={{
                        background:
                          'rgba(236,72,153,0.08)',
                        border:
                          '1px solid rgba(236,72,153,0.25)',
                      }}
                    >
                      <div className="mental-heart-mini-wrapper">
                        <div className="mental-heart-mini" />
                      </div>
                    </div>
                  )}

                  <div
                    className="
                      max-w-[84%]
                      px-4
                      py-3
                      rounded-2xl
                      text-sm
                      leading-relaxed
                      whitespace-pre-wrap
                    "
                    style={
                      isUser
                        ? {
                            background:
                              'linear-gradient(135deg, #7c3aed, #5b21b6)',
                            color:
                              'white',
                            borderBottomRightRadius:
                              6,
                          }
                        : {
                            background:
                              '#1e1e3a',
                            color:
                              '#f1f0fa',
                            border:
                              '1px solid rgba(42,42,74,0.8)',
                            borderBottomLeftRadius:
                              6,
                          }
                    }
                  >
                    {message.content}
                  </div>
                </div>
              );
            }
          )}

          {loading && (
            <div
              className="
                flex
                justify-start
                gap-2
              "
            >
              <div
                className="
                  w-8
                  h-8
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
                style={{
                  background:
                    'rgba(236,72,153,0.08)',
                  border:
                    '1px solid rgba(236,72,153,0.25)',
                }}
              >
                <div className="mental-heart-mini-wrapper">
                  <div className="mental-heart-mini" />
                </div>
              </div>

              <div
                className="
                  px-4
                  py-3
                  rounded-2xl
                  flex
                  items-center
                  gap-2
                "
                style={{
                  background:
                    '#1e1e3a',
                  border:
                    '1px solid rgba(42,42,74,0.8)',
                  borderBottomLeftRadius:
                    6,
                }}
              >
                <Loader2
                  size={14}
                  className="
                    text-pink-400
                    animate-spin
                  "
                />

                <span className="text-sm text-[#8b8aaa]">
                  Pensando...
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div
          className="
            fixed
            bottom-16
            left-0
            right-0
            px-4
            py-3
            z-40
          "
          style={{
            background:
              'rgba(11,11,24,0.95)',
            backdropFilter:
              'blur(20px)',
            borderTop:
              '1px solid rgba(42,42,74,0.6)',
          }}
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              px-4
              py-2
              max-w-lg
              mx-auto
            "
            style={{
              background:
                '#1e1e3a',
              border:
                '1px solid rgba(236,72,153,0.25)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              disabled={loading}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={
                loading
                  ? 'Aguarde...'
                  : 'Conte como está se sentindo...'
              }
              className="
                flex-1
                bg-transparent
                text-sm
                text-white
                placeholder-[#4e4d6a]
                outline-none
                disabled:opacity-60
              "
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={
                !input.trim() ||
                loading
              }
              className="
                p-2
                rounded-xl
                transition-all
                flex
                items-center
                justify-center
              "
              style={
                input.trim() && !loading
                  ? {
                      background:
                        'linear-gradient(135deg, #ec4899, #be185d)',
                      color:
                        'white',
                    }
                  : {
                      background:
                        'rgba(236,72,153,0.1)',
                      color:
                        '#4e4d6a',
                      cursor:
                        'not-allowed',
                    }
              }
            >
              {loading ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
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

function ResourceButton({
  resource,
}: {
  resource: Resource;
}) {
  const content = (
    <>
      <div
        className="
          w-9
          h-9
          rounded-xl
          flex
          items-center
          justify-center
          flex-shrink-0
        "
        style={{
          background:
            `${resource.accent}18`,
          color:
            resource.accent,
        }}
      >
        {resource.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="
            text-sm
            font-semibold
            text-white
          "
        >
          {resource.title}
        </p>

        <p
          className="
            text-xs
            text-[#8b8aaa]
            mt-0.5
            leading-relaxed
          "
        >
          {resource.description}
        </p>
      </div>

      {resource.phone && (
        <span
          className="
            text-sm
            font-bold
            text-emerald-400
          "
        >
          {resource.phone}
        </span>
      )}

      {resource.href && (
        <ExternalLink
          size={15}
          className="text-[#8b8aaa]"
        />
      )}
    </>
  );

  const className = `
    w-full
    flex
    items-center
    gap-3
    p-3
    rounded-xl
    text-left
    transition-all
    hover:brightness-110
  `;

  const style = {
    background:
      'rgba(20,20,42,0.85)',
    border:
      `1px solid ${resource.accent}25`,
  };

  if (resource.phone) {
    return (
      <a
        href="tel:188"
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  if (resource.href) {
    return (
      <a
        href={resource.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={className}
      style={style}
    >
      {content}
    </div>
  );
}
