import { useState, useEffect, useRef, useCallback } from 'react';

import {
  KeyRound,
  Timer,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ChevronRight,
  RotateCcw,
  Trophy,
  Users,
  Lock,
} from 'lucide-react';

import { escapeStages } from '../services/escapeRoomService';

import type {
  EscapeStage,
  EscapeStageStatus,
} from '../types';

const TOTAL_SECONDS = 30 * 60;

const subjectMeta: Record<
  EscapeStage['subject'],
  {
    label: string;
    emoji: string;
    color: string;
  }
> = {
  matematica: {
    label: 'Matemática',
    emoji: '📐',
    color: '#f59e0b',
  },

  portugues: {
    label: 'Português',
    emoji: '📖',
    color: '#ef4444',
  },

  logica: {
    label: 'Lógica',
    emoji: '🧩',
    color: '#8b5cf6',
  },

  geral: {
    label: 'Conhecimentos Gerais',
    emoji: '🌍',
    color: '#06b6d4',
  },

  enigma: {
    label: 'Enigma',
    emoji: '🔮',
    color: '#a78bfa',
  },

  colaborativo: {
    label: 'Colaborativo',
    emoji: '🤝',
    color: '#10b981',
  },
};

type GamePhase =
  | 'intro'
  | 'playing'
  | 'finished';

export function EscapeRoomPage() {
  const [phase, setPhase] =
    useState<GamePhase>('intro');

  const [currentStageIndex, setCurrentStageIndex] =
    useState(0);

  const [stageStatuses, setStageStatuses] =
    useState<EscapeStageStatus[]>(
      escapeStages.map((_, i) =>
        i === 0 ? 'active' : 'locked'
      )
    );

  const [timeLeft, setTimeLeft] =
    useState(TOTAL_SECONDS);

  const [totalScore, setTotalScore] =
    useState(0);

  const [selectedOption, setSelectedOption] =
    useState('');

  const [textInput, setTextInput] =
    useState('');

  const [showHint, setShowHint] =
    useState(false);

  const [feedback, setFeedback] =
    useState<
      'correct' | 'wrong' | null
    >(null);

  const [shaking, setShaking] =
    useState(false);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  /* =========================================================
     TIMER
  ========================================================== */

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();

    timerRef.current =
      setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            stopTimer();
            setPhase('finished');
            return 0;
          }

          return t - 1;
        });
      }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    if (phase === 'playing') {
      startTimer();
    }

    return stopTimer;
  }, [phase, startTimer, stopTimer]);

  /* =========================================================
     TIMER FORMAT
  ========================================================== */

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');

    const s = (secs % 60)
      .toString()
      .padStart(2, '0');

    return `${m}:${s}`;
  };

  const timerColor =
    timeLeft < 120
      ? '#ef4444'
      : timeLeft < 300
      ? '#f59e0b'
      : '#10b981';

  const currentStage =
    escapeStages[currentStageIndex];

  const allSolved =
    stageStatuses.every(
      (s) => s === 'solved'
    );

  /* =========================================================
     SUBMIT ANSWER
  ========================================================== */

  const handleSubmit = () => {
    const stage = currentStage;

    const userAnswer =
      stage.type === 'text_input'
        ? textInput
            .trim()
            .toLowerCase()
        : selectedOption;

    const correct =
      stage.answer === 'any' ||
      userAnswer ===
        stage.answer.toLowerCase() ||
      userAnswer ===
        stage.answer;

    if (correct) {
      setFeedback('correct');

      setTotalScore(
        (s) => s + stage.points
      );

      const newStatuses = [
        ...stageStatuses,
      ];

      newStatuses[currentStageIndex] =
        'solved';

      if (
        currentStageIndex + 1 <
        escapeStages.length
      ) {
        newStatuses[
          currentStageIndex + 1
        ] = 'active';
      }

      setStageStatuses(newStatuses);

      setTimeout(() => {
        setFeedback(null);
        setSelectedOption('');
        setTextInput('');
        setShowHint(false);

        if (
          currentStageIndex + 1 >=
          escapeStages.length
        ) {
          stopTimer();
          setPhase('finished');
        } else {
          setCurrentStageIndex(
            (i) => i + 1
          );
        }
      }, 1400);
    } else {
      setFeedback('wrong');
      setShaking(true);

      setTimeout(() => {
        setFeedback(null);
        setShaking(false);
      }, 1000);
    }
  };

  /* =========================================================
     RESTART
  ========================================================== */

  const restart = () => {
    stopTimer();

    setPhase('intro');

    setCurrentStageIndex(0);

    setStageStatuses(
      escapeStages.map((_, i) =>
        i === 0
          ? 'active'
          : 'locked'
      )
    );

    setTimeLeft(TOTAL_SECONDS);

    setTotalScore(0);

    setSelectedOption('');

    setTextInput('');

    setShowHint(false);

    setFeedback(null);

    setShaking(false);
  };

  /* =========================================================
     ESTILOS DO PAC-MAN + BOTÃO
  ========================================================== */

  const introStyles = `
    .escape-page {
      --escape-bg: #0b0b18;
    }

    /* =======================================================
       PAC-MAN LOADER
    ======================================================== */

    .escape-loader-container {
      width: 150px;
      height: 72px;

      position: relative;

      margin: 0 auto;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: visible;
    }

    .escape-loader-wrapper {
      position: relative;

      width: 125px;
      height: 40px;

      margin: auto;
    }

    .escape-packman::before {
      content: '';

      position: absolute;

      left: 22px;
      top: 20px;

      width: 50px;
      height: 25px;

      background-color: #EFF107;

      border-radius:
        100px
        100px
        0
        0;

      transform:
        translate(-50%, -50%);

      animation:
        escape-pac-top
        0.5s
        linear
        infinite;

      transform-origin:
        center bottom;

      z-index: 3;

      box-shadow:
        0 0 18px
        rgba(239,241,7,0.5);
    }

    .escape-packman::after {
      content: '';

      position: absolute;

      left: 22px;
      top: 20px;

      width: 50px;
      height: 25px;

      background-color: #EFF107;

      border-radius:
        0
        0
        100px
        100px;

      transform:
        translate(-50%, 50%);

      animation:
        escape-pac-bot
        0.5s
        linear
        infinite;

      transform-origin:
        center top;

      z-index: 3;

      box-shadow:
        0 0 18px
        rgba(239,241,7,0.5);
    }

    @keyframes escape-pac-top {
      0% {
        transform:
          translate(-50%, -50%)
          rotate(0);
      }

      50% {
        transform:
          translate(-50%, -50%)
          rotate(-30deg);
      }

      100% {
        transform:
          translate(-50%, -50%)
          rotate(0);
      }
    }

    @keyframes escape-pac-bot {
      0% {
        transform:
          translate(-50%, 50%)
          rotate(0);
      }

      50% {
        transform:
          translate(-50%, 50%)
          rotate(30deg);
      }

      100% {
        transform:
          translate(-50%, 50%)
          rotate(0);
      }
    }

    .escape-dots .escape-dot {
      position: absolute;

      z-index: 1;

      top: 15px;

      width: 10px;
      height: 10px;

      border-radius: 50%;

      background: #ffffff;

      box-shadow:
        0 0 8px
        rgba(255,255,255,0.3);
    }

    .escape-dots
      .escape-dot:nth-child(1) {
      left: 110px;

      animation:
        escape-dot-stage1
        0.5s
        infinite;
    }

    .escape-dots
      .escape-dot:nth-child(2) {
      left: 80px;

      animation:
        escape-dot-stage1
        0.5s
        infinite;
    }

    .escape-dots
      .escape-dot:nth-child(3) {
      left: 50px;

      animation:
        escape-dot-stage1
        0.5s
        infinite;
    }

    .escape-dots
      .escape-dot:nth-child(4) {
      left: 30px;

      animation:
        escape-dot-stage2
        0.5s
        infinite;
    }

    @keyframes escape-dot-stage1 {
      0% {
        transform:
          translate(0, 0);
      }

      100% {
        transform:
          translate(-24px, 0);
      }
    }

    @keyframes escape-dot-stage2 {
      0% {
        transform:
          scale(1);
      }

      5%,
      100% {
        transform:
          scale(0);
      }
    }

    /* =======================================================
       BOTÃO GLOW
    ======================================================== */

    .escape-glow-button {
      --glow-color:
        rgb(176, 252, 255);

      --glow-spread-color:
        rgba(123, 251, 255, 0.781);

      --enhanced-glow-color:
        rgb(206, 255, 255);

      --btn-color:
        rgb(61, 127, 136);

      border:
        0.25em
        solid
        var(--glow-color);

      padding:
        0.85em
        2.6em;

      color:
        var(--glow-color);

      font-size: 15px;

      font-weight: bold;

      background-color:
        var(--btn-color);

      border-radius:
        1em;

      outline: none;

      box-shadow:
        0 0 1em
        0.25em
        var(--glow-color),

        0 0 4em
        1em
        var(--glow-spread-color),

        inset
        0 0 0.75em
        0.25em
        var(--glow-color);

      text-shadow:
        0 0 0.5em
        var(--glow-color);

      position: relative;

      transition:
        all 0.3s;

      cursor: pointer;

      min-width: 250px;
    }

    .escape-glow-button::after {
      pointer-events: none;

      content: "";

      position: absolute;

      top: 120%;
      left: 0;

      height: 100%;
      width: 100%;

      background-color:
        var(--glow-spread-color);

      filter:
        blur(2em);

      opacity: 0.7;

      transform:
        perspective(1.5em)
        rotateX(35deg)
        scale(1, 0.6);
    }

    .escape-glow-button:hover {
      color:
        var(--btn-color);

      background-color:
        var(--glow-color);

      box-shadow:
        0 0 1em
        0.25em
        var(--glow-color),

        0 0 4em
        2em
        var(--glow-spread-color),

        inset
        0 0 0.75em
        0.25em
        var(--glow-color);
    }

    .escape-glow-button:active {
      box-shadow:
        0 0 0.6em
        0.25em
        var(--glow-color),

        0 0 2.5em
        2em
        var(--glow-spread-color),

        inset
        0 0 0.5em
        0.25em
        var(--glow-color);
    }
  `;

  /* =========================================================
     INTRO
  ========================================================== */

  if (phase === 'intro') {
    return (
      <>
        <style>
          {introStyles}
        </style>

        <div
          className="
            escape-page
            flex-1
            overflow-y-auto
            pb-24
            px-5
          "
        >

          <div
            className="
              pt-10
              pb-8
              flex
              flex-col
              items-center
              text-center
            "
          >
            <div
              className="
                escape-loader-container
                mb-3
              "
            >
              <div className="escape-loader-wrapper">
                <div className="escape-packman" />

                <div className="escape-dots">
                  <div className="escape-dot" />
                  <div className="escape-dot" />
                  <div className="escape-dot" />
                  <div className="escape-dot" />
                </div>
              </div>
            </div>

            <h1
              className="
                font-['Outfit']
                text-3xl
                md:text-4xl
                font-bold
                text-white
                tracking-tight
              "
            >
              Escape Room Digital
            </h1>

            <p
              className="
                text-sm
                text-[#8b8aaa]
                mt-2
              "
            >
              Resolva os desafios antes que o
              sistema seja apagado.
            </p>
          </div>

          <div
            className="
              max-w-4xl
              mx-auto
              mb-8
            "
          >
            <div
              className="
                rounded-2xl
                p-6
                relative
                overflow-hidden
              "
              style={{
                background:
                  'linear-gradient(135deg, #1a0a2e, #0f1a2e)',

                border:
                  '1px solid rgba(239,68,68,0.3)',

                boxShadow:
                  '0 12px 35px rgba(0,0,0,0.22)',
              }}
            >
              <div
                className="
                  absolute
                  top-4
                  right-4
                "
              >
                <span
                  className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    text-red-400
                    font-semibold
                    font-['Outfit']
                    animate-pulse
                  "
                >
                  <AlertTriangle size={12} />

                  ALERTA DE SEGURANÇA
                </span>
              </div>

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  mb-4
                "
                style={{
                  background:
                    'rgba(239,68,68,0.12)',

                  border:
                    '1px solid rgba(239,68,68,0.3)',

                  boxShadow:
                    '0 0 20px rgba(239,68,68,0.15)',
                }}
              >
                <span className="text-2xl">
                  🔴
                </span>
              </div>

              <h2
                className="
                  font-['Outfit']
                  text-xl
                  font-bold
                  text-red-400
                  mb-3
                "
              >
                SISTEMA ESCOLAR COMPROMETIDO
              </h2>

              <p
                className="
                  text-sm
                  text-[#c4b5fd]
                  leading-relaxed
                  max-w-4xl
                "
              >
                Um hacker invadiu o sistema da escola
                e bloqueou todos os dados: notas,
                chamadas e materiais digitais. Vocês têm{' '}
                <span className="text-white font-bold">
                  30 minutos
                </span>{' '}
                para resolver 6 desafios e recuperar
                o sistema antes que tudo seja deletado
                permanentemente.
              </p>

              <div
                className="
                  mt-5
                  p-3
                  rounded-xl
                  text-xs
                  text-[#8b8aaa]
                  flex
                  items-start
                  gap-2
                "
                style={{
                  background:
                    'rgba(255,255,255,0.04)',
                }}
              >
                <Users
                  size={14}
                  className="
                    flex-shrink-0
                    mt-0.5
                    text-emerald-400
                  "
                />

                <span>
                  <span
                    className="
                      text-emerald-400
                      font-semibold
                    "
                  >
                    Dica de equipe:
                  </span>{' '}
                  Alguns desafios exigem interação
                  com colegas ao redor. Fique atento!
                </span>
              </div>
            </div>
          </div>


          <div
            className="
              flex
              justify-center
              mb-12
              relative
              z-10
            "
          >
            <button
              type="button"
              onClick={() =>
                setPhase('playing')
              }
              className="
                escape-glow-button
              "
            >
              🚨 INICIAR O JOGO
            </button>
          </div>

          <div
            className="
              max-w-4xl
              mx-auto
            "
          >
            <div className="mb-4">
              <p
                className="
                  text-xs
                  text-[#8b8aaa]
                  font-semibold
                  uppercase
                  tracking-wider
                "
              >
                6 Módulos para Recuperar
              </p>

              <p
                className="
                  text-sm
                  text-[#4e4d6a]
                  mt-1
                "
              >
                Estes são os desafios que você
                encontrará durante a missão.
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-3
              "
            >
              {escapeStages.map(
                (stage) => {
                  const meta =
                    subjectMeta[
                      stage.subject
                    ];

                  return (
                    <div
                      key={stage.id}
                      className="
                        flex
                        items-center
                        gap-3
                        p-4
                        rounded-xl
                        transition-all
                      "
                      style={{
                        background:
                          '#14142a',

                        border:
                          `1px solid ${meta.color}30`,
                      }}
                    >
                      <div
                        className="
                          w-10
                          h-10
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          text-lg
                          flex-shrink-0
                        "
                        style={{
                          background:
                            `${meta.color}22`,

                          border:
                            `1px solid ${meta.color}33`,
                        }}
                      >
                        {meta.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="
                            text-sm
                            font-semibold
                            text-white
                            truncate
                          "
                        >
                          {stage.title}
                        </p>

                        <p
                          className="
                            text-xs
                            mt-0.5
                          "
                          style={{
                            color:
                              meta.color,
                          }}
                        >
                          {meta.label}
                        </p>
                      </div>

                      <div
                        className="
                          text-right
                          flex-shrink-0
                        "
                      >
                        <p
                          className="
                            text-sm
                            font-bold
                            text-amber-400
                            font-['Outfit']
                          "
                        >
                          +{stage.points}
                        </p>

                        <p
                          className="
                            text-xs
                            text-[#4e4d6a]
                          "
                        >
                          pts
                        </p>
                      </div>

                      {stage.requiresPhysical && (
                        <Users
                          size={15}
                          className="
                            text-emerald-400
                            flex-shrink-0
                          "
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     FINISHED
  ========================================================== */

  if (phase === 'finished') {
    const maxScore =
      escapeStages.reduce(
        (a, s) => a + s.points,
        0
      );

    const pct =
      Math.round(
        (totalScore / maxScore) * 100
      );

    const outOfTime =
      timeLeft === 0 &&
      !allSolved;

    return (
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
            pb-6
            text-center
          "
        >
          <div className="text-6xl mb-4">
            {outOfTime
              ? '💀'
              : pct >= 80
              ? '🏆'
              : '🛡️'}
          </div>

          <h1
            className="
              font-['Outfit']
              text-2xl
              font-bold
              text-white
              mb-2
            "
          >
            {outOfTime
              ? 'Tempo Esgotado!'
              : pct === 100
              ? 'Sistema Recuperado!'
              : 'Missão Parcial'}
          </h1>

          <p
            className="
              text-sm
              text-[#8b8aaa]
              mb-6
            "
          >
            {outOfTime
              ? 'O hacker ganhou desta vez. Tente novamente!'
              : 'Parabéns, agente! Você protegeu os dados da escola.'}
          </p>

          <div
            className="
              max-w-lg
              mx-auto
              rounded-2xl
              p-6
              mb-6
            "
            style={{
              background:
                '#14142a',

              border:
                '1px solid rgba(124,58,237,0.3)',
            }}
          >
            <p
              className="
                text-5xl
                font-bold
                font-['Outfit']
                text-white
              "
            >
              {totalScore}
            </p>

            <p
              className="
                text-sm
                text-[#8b8aaa]
                mt-1
              "
            >
              pontos conquistados
            </p>

            <div
              className="
                mt-4
                h-3
                rounded-full
                overflow-hidden
              "
              style={{
                background:
                  '#1e1e3a',
              }}
            >
              <div
                className="
                  h-full
                  rounded-full
                  transition-all
                  duration-1000
                "
                style={{
                  width:
                    `${pct}%`,

                  background:
                    'linear-gradient(to right, #7c3aed, #06b6d4)',
                }}
              />
            </div>

            <p
              className="
                text-xs
                text-violet-400
                mt-2
              "
            >
              {pct}% do máximo possível
              ({maxScore} pts)
            </p>
          </div>

          <div
            className="
              max-w-lg
              mx-auto
              flex
              flex-col
              gap-2
              mb-6
            "
          >
            {escapeStages.map(
              (stage, i) => {
                const meta =
                  subjectMeta[
                    stage.subject
                  ];

                const solved =
                  stageStatuses[i] ===
                  'solved';

                return (
                  <div
                    key={stage.id}
                    className="
                      flex
                      items-center
                      gap-3
                      p-3
                      rounded-xl
                      text-left
                    "
                    style={{
                      background:
                        solved
                          ? 'rgba(16,185,129,0.1)'
                          : 'rgba(239,68,68,0.08)',

                      border:
                        `1px solid ${
                          solved
                            ? 'rgba(16,185,129,0.3)'
                            : 'rgba(239,68,68,0.2)'
                        }`,
                    }}
                  >
                    <span className="text-xl">
                      {meta.emoji}
                    </span>

                    <span
                      className="
                        flex-1
                        text-sm
                        text-white
                      "
                    >
                      {stage.title}
                    </span>

                    {solved ? (
                      <CheckCircle2
                        size={16}
                        className="
                          text-emerald-400
                        "
                      />
                    ) : (
                      <Lock
                        size={16}
                        className="
                          text-red-400
                        "
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>

          <button
            type="button"
            onClick={restart}
            className="
              max-w-lg
              mx-auto
              w-full
              py-3.5
              rounded-2xl
              font-['Outfit']
              font-semibold
              text-white
              flex
              items-center
              justify-center
              gap-2
              transition-all
              active:scale-95
            "
            style={{
              background:
                'linear-gradient(135deg, #7c3aed, #5b21b6)',
            }}
          >
            <RotateCcw size={16} />

            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     PLAYING
  ========================================================== */

  const meta =
    subjectMeta[
      currentStage.subject
    ];

  return (
    <div className="flex flex-col h-full">

      <div
        className="
          flex-shrink-0
          px-5
          pt-10
          pb-3
        "
        style={{
          background:
            '#0b0b18',
          borderBottom:
            '1px solid #1e1e3a',
        }}
      >
        <div
          className="
            flex
            items-center
            justify-between
            mb-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
            "
            style={{
              background:
                `${timerColor}18`,
              border:
                `1px solid ${timerColor}44`,
            }}
          >
            <Timer
              size={14}
              style={{
                color:
                  timerColor,
              }}
            />

            <span
              className="
                font-['Outfit']
                font-bold
                text-base
              "
              style={{
                color:
                  timerColor,
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Shield
              size={16}
              className="
                text-violet-400
              "
            />

            <span
              className="
                font-['Outfit']
                font-bold
                text-amber-400
              "
            >
              {totalScore} pts
            </span>
          </div>
        </div>

        <div
          className="
            flex
            gap-1.5
            justify-center
          "
        >
          {escapeStages.map(
            (_, i) => {
              const s =
                stageStatuses[i];

              return (
                <div
                  key={i}
                  className="
                    rounded-full
                    transition-all
                    duration-300
                  "
                  style={{
                    width:
                      i ===
                      currentStageIndex
                        ? 24
                        : 8,

                    height: 8,

                    background:
                      s === 'solved'
                        ? '#10b981'
                        : s === 'active'
                        ? '#7c3aed'
                        : '#2a2a4a',
                  }}
                />
              );
            }
          )}
        </div>
      </div>

      <div
        className="
          flex-1
          overflow-y-auto
          px-5
          py-4
        "
        style={{
          minHeight: 0,
        }}
      >
        <div
          className="
            flex
            items-center
            gap-2
            mb-4
          "
        >
          <div
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              text-xl
            "
            style={{
              background:
                `${meta.color}22`,

              border:
                `1px solid ${meta.color}44`,
            }}
          >
            {meta.emoji}
          </div>

          <div>
            <p
              className="
                text-xs
                font-semibold
              "
              style={{
                color:
                  meta.color,
              }}
            >
              {meta.label}
            </p>

            <p
              className="
                font-['Outfit']
                font-bold
                text-white
                text-base
              "
            >
              {currentStage.title}
            </p>
          </div>

          <div className="ml-auto">
            <span
              className="
                text-xs
                font-bold
                px-2
                py-1
                rounded-full
                font-['Outfit']
              "
              style={{
                background:
                  'rgba(245,158,11,0.15)',
                color:
                  '#f59e0b',
              }}
            >
              +{currentStage.points} pts
            </span>
          </div>
        </div>

        <div
          className="
            rounded-xl
            p-4
            mb-4
            text-sm
            text-[#c4b5fd]
            leading-relaxed
          "
          style={{
            background:
              'rgba(124,58,237,0.08)',

            border:
              '1px solid rgba(124,58,237,0.2)',
          }}
        >
          {currentStage.narrative}
        </div>

        {currentStage.requiresPhysical && (
          <div
            className="
              rounded-xl
              p-3
              mb-4
              flex
              items-start
              gap-2
            "
            style={{
              background:
                'rgba(16,185,129,0.1)',

              border:
                '1px solid rgba(16,185,129,0.3)',
            }}
          >
            <Users
              size={16}
              className="
                text-emerald-400
                mt-0.5
                flex-shrink-0
              "
            />

            <p
              className="
                text-xs
                text-emerald-300
                font-semibold
              "
            >
              Este desafio requer interação
              presencial com seus colegas!
            </p>
          </div>
        )}

        <p
          className="
            font-semibold
            text-white
            mb-4
            leading-relaxed
            whitespace-pre-line
          "
        >
          {currentStage.question}
        </p>

        {(
          currentStage.type ===
            'multiple_choice' ||
          currentStage.type ===
            'collaborative'
        ) &&
          currentStage.options && (
            <div
              className="
                flex
                flex-col
                gap-2
                mb-4
              "
            >
              {currentStage.options.map(
                (opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setSelectedOption(
                        opt
                      )
                    }
                    className="
                      p-4
                      rounded-xl
                      text-left
                      text-sm
                      transition-all
                    "
                    style={
                      selectedOption ===
                      opt
                        ? {
                            background:
                              'rgba(124,58,237,0.25)',
                            border:
                              '2px solid #7c3aed',
                            color:
                              'white',
                          }
                        : {
                            background:
                              '#14142a',
                            border:
                              '1px solid #2a2a4a',
                            color:
                              '#c4b5fd',
                          }
                    }
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          )}

        {currentStage.type ===
          'text_input' && (
          <div className="mb-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) =>
                setTextInput(
                  e.target.value
                )
              }
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                handleSubmit()
              }
              placeholder="Digite sua resposta…"
              className={`
                w-full
                px-4
                py-3.5
                rounded-xl
                text-sm
                text-white
                outline-none
                transition-all
                ${
                  shaking
                    ? 'animate-bounce'
                    : ''
                }
              `}
              style={{
                background:
                  '#14142a',
                border:
                  '1px solid #2a2a4a',
              }}
            />
          </div>
        )}

        {feedback === 'correct' && (
          <div
            className="
              flex
              items-center
              gap-2
              p-3
              rounded-xl
              mb-4
            "
            style={{
              background:
                'rgba(16,185,129,0.15)',
              border:
                '1px solid rgba(16,185,129,0.4)',
            }}
          >
            <CheckCircle2
              size={16}
              className="
                text-emerald-400
              "
            />

            <span
              className="
                text-sm
                text-emerald-300
                font-semibold
              "
            >
              Correto! +{currentStage.points}
              {' '}pontos 🎉
            </span>
          </div>
        )}

        {feedback === 'wrong' && (
          <div
            className="
              flex
              items-center
              gap-2
              p-3
              rounded-xl
              mb-4
            "
            style={{
              background:
                'rgba(239,68,68,0.12)',
              border:
                '1px solid rgba(239,68,68,0.35)',
            }}
          >
            <AlertTriangle
              size={16}
              className="
                text-red-400
              "
            />

            <span
              className="
                text-sm
                text-red-300
                font-semibold
              "
            >
              Resposta incorreta.
              Tente novamente!
            </span>
          </div>
        )}

        {showHint &&
          currentStage.hint && (
            <div
              className="
                flex
                items-start
                gap-2
                p-3
                rounded-xl
                mb-4
              "
              style={{
                background:
                  'rgba(245,158,11,0.1)',
                border:
                  '1px solid rgba(245,158,11,0.3)',
              }}
            >
              <Lightbulb
                size={14}
                className="
                  text-amber-400
                  mt-0.5
                  flex-shrink-0
                "
              />

              <p
                className="
                  text-xs
                  text-amber-300
                "
              >
                {currentStage.hint}
              </p>
            </div>
          )}

      
      
        <div
          className="
            flex
            gap-2
            pb-6
          "
        >
          {currentStage.hint && (
            <button
              type="button"
              onClick={() =>
                setShowHint(
                  (v) => !v
                )
              }
              className="
                flex
                items-center
                gap-1.5
                px-4
                py-3
                rounded-xl
                text-sm
                font-semibold
                transition-all
              "
              style={{
                background:
                  'rgba(245,158,11,0.1)',
                color:
                  '#f59e0b',
                border:
                  '1px solid rgba(245,158,11,0.2)',
              }}
            >
              <Lightbulb size={14} />

              {showHint
                ? 'Ocultar'
                : 'Dica'}
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !selectedOption &&
              !textInput.trim()
            }
            className="
              flex-1
              py-3
              rounded-xl
              font-['Outfit']
              font-bold
              text-white
              flex
              items-center
              justify-center
              gap-2
              transition-all
              active:scale-95
              disabled:opacity-40
            "
            style={{
              background:
                'linear-gradient(135deg, #7c3aed, #5b21b6)',
            }}
          >
            Confirmar

            <ChevronRight
              size={16}
            />
          </button>
        </div>
      </div>
    </div>
  );
}