import { useState, useEffect } from 'react';

import {
  Lock,
  PlayCircle,
  CheckCircle,
  Star,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

import {
  videoService,
  SUBJECTS,
  type SubjectId,
} from '../services/videoService';

import { useAppContext } from '../context/AppContext';

import { VideoModal } from '../components/VideoModal';

import type {
  TrailNode,
  NodeStatus,
} from '../types';

export function TrailPage() {
  const {
    isCompleted,
    progress,
  } = useAppContext();

  const [phase, setPhase] = useState<'picker' | 'trail'>('picker');

  const [selectedSubject, setSelectedSubject] =
    useState<SubjectId>('all');

  const [nodes, setNodes] =
    useState<TrailNode[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selected, setSelected] =
    useState<TrailNode | null>(null);


  const loadTrail = async (subject: SubjectId) => {
    setLoading(true);

    const videos =
      await videoService.getAll(subject);

    const trail: TrailNode[] =
      videos.map((v, i) => {
        const completed =
          isCompleted(v.id);

        let status: NodeStatus =
          'locked';

        if (completed) {
          status = 'completed';
        } else if (
          i === 0 ||
          isCompleted(
            videos[i - 1].id
          )
        ) {
          status = 'available';
        }

        return {
          ...v,
          status,
        };
      });

    setNodes(trail);
    setLoading(false);
  };

  useEffect(() => {
    if (phase === 'trail') {
      loadTrail(selectedSubject);
    }
  }, [phase, progress]);
  const handleStart = (
    subject: SubjectId
  ) => {
    setSelectedSubject(subject);
    setPhase('trail');
    loadTrail(subject);
  };

  const cardStyles = `
    .subject-card {
      --primary-clr: #1c204b;
      --dot-clr: #bbc0ff;
      --play: hsl(195, 74%, 62%);

      width: 100%;
      height: 260px;

      border-radius: 16px;

      font-family: Arial, sans-serif;
      color: #fff;

      display: grid;
      grid-template-rows: 95px 1fr;

      cursor: pointer;

      padding: 0;
      border: 0;
      background: transparent;

      transition:
        transform 0.2s ease,
        filter 0.2s ease;
    }

    .subject-card:hover {
      transform: translateY(-3px);
      filter: brightness(1.06);
    }

    .subject-card:active {
      transform: scale(0.98);
    }

    .subject-card .subject-img-section {
      transition:
        0.2s cubic-bezier(
          0.25,
          0.46,
          0.45,
          0.94
        );

      border-top-left-radius: 16px;
      border-top-right-radius: 16px;

      background: var(--play);

      display: flex;
      align-items: center;
      justify-content: center;

      position: relative;
      z-index: 2;

      overflow: hidden;
    }

    .subject-card:hover .subject-img-section {
      transform: translateY(6px);
    }

    .subject-card .subject-desc {
      border-radius: 16px;

      padding: 20px;

      position: relative;
      top: -10px;

      min-height: 175px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      gap: 14px;

      background:
        linear-gradient(
          135deg,
          #1c204b,
          #171a3c
        );

      border:
        1px solid
        rgba(255,255,255,0.08);

      box-shadow:
        0 12px 30px
        rgba(0,0,0,0.22);

      z-index: 1;

      text-align: center;
    }

    .subject-card .subject-header {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      gap: 8px;
    }

    .subject-card .subject-title {
      flex: 1;

      font-size: 1.15em;
      font-weight: 700;

      line-height: 1.15;

      text-align: center;
    }

    .subject-card .subject-menu {
      display: flex;
      gap: 4px;

      margin-left: auto;
    }

    .subject-card .subject-dot {
      width: 5px;
      height: 5px;

      border-radius: 50%;

      background:
        var(--dot-clr);
    }

    .subject-card .subject-recent {
      line-height: 1;

      font-size: 0.85em;

      color: #aaa8c7;

      text-align: center;
    }

    .subject-card .subject-emoji {
      font-size: 3.2rem;

      line-height: 1;

      filter:
        drop-shadow(
          0 0 14px
          rgba(255,255,255,0.2)
        );
    }

    .subject-card .subject-arrow {
      transition:
        transform 0.2s ease;
    }

    .subject-card:hover
      .subject-arrow {
      transform: translateX(3px);
    }

    @media (max-width: 640px) {
      .subject-card {
        height: 230px;
        grid-template-rows: 85px 1fr;
      }

      .subject-card .subject-desc {
        min-height: 155px;
        padding: 16px;
      }

      .subject-card .subject-emoji {
        font-size: 2.8rem;
      }

      .subject-card .subject-title {
        font-size: 1em;
      }
    }
  `;


  if (phase === 'picker') {
    return (
      <>
        <style>{cardStyles}</style>

        <div
          className="
            flex-1
            overflow-y-auto
            pb-24
          "
        >

          <div
            className="
              px-5
              pt-10
              pb-7
              text-center
            "
          >
            <h1
              className="
                font-['Outfit']
                text-3xl
                font-bold
                text-white
                mb-2
              "
            >
              Trilha de Estudos
            </h1>

            <p className="text-sm text-[#8b8aaa]">
              Escolha uma matéria para começar
            </p>
          </div>


          <div
            className="
              mx-5
              mb-7
              rounded-2xl
              p-5
              relative
              overflow-hidden
            "
            style={{
              background:
                'linear-gradient(135deg, #1e1e3a, #2a1a4a)',
            }}
          >
            <div
              className="
                absolute
                inset-0
                opacity-30
              "
              style={{
                background:
                  'radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 60%)',
              }}
            />

            <div
              className="
                relative
                z-10
                text-center
              "
            >
              <p
                className="
                  text-xs
                  text-violet-300
                  font-semibold
                  font-['Outfit']
                  mb-1
                "
              >
                SEU PROGRESSO
              </p>

              <p
                className="
                  text-3xl
                  font-bold
                  text-white
                  font-['Outfit']
                "
              >
                {progress.completedVideoIds.length}{' '}

                <span
                  className="
                    text-lg
                    font-normal
                    text-[#8b8aaa]
                  "
                >
                  vídeos concluídos
                </span>
              </p>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  mt-2
                "
              >
                <Star
                  size={14}
                  className="
                    text-amber-400
                    fill-amber-400
                  "
                />

                <span
                  className="
                    text-amber-400
                    font-semibold
                    font-['Outfit']
                  "
                >
                  {progress.totalScore} pontos
                </span>
              </div>
            </div>
          </div>


          <div
            className="
              px-5
              grid
              grid-cols-2
              gap-4
              items-stretch
            "
          >
            {SUBJECTS.map(
              ({
                id,
                label,
                emoji,
                color,
              }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    handleStart(
                      id as SubjectId
                    )
                  }
                  className="subject-card"
                  style={{
                    ['--play' as string]:
                      color,
                  }}
                >

                  <div
                    className="
                      subject-img-section
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-0
                      "
                      style={{
                        background:
                          'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.28), transparent 58%)',
                      }}
                    />

                    <span
                      className="
                        subject-emoji
                        relative
                        z-10
                      "
                    >
                      {emoji}
                    </span>
                  </div>

                  <div
                    className="
                      subject-desc
                    "
                  >
                    <div
                      className="
                        subject-header
                      "
                    >
                      <span
                        className="
                          subject-title
                        "
                      >
                        {label}
                      </span>

                      <div
                        className="
                          subject-menu
                        "
                      >
                        <div className="subject-dot" />
                        <div className="subject-dot" />
                        <div className="subject-dot" />
                      </div>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-1
                        subject-recent
                      "
                    >
                      <span>
                        Ver trilha
                      </span>

                      <ChevronRight
                        size={13}
                        className="
                          subject-arrow
                        "
                      />
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      </>
    );
  }


  const subjectInfo =
    SUBJECTS.find(
      (s) =>
        s.id === selectedSubject
    )!;

  if (loading) {
    return (
      <div
        className="
          flex-1
          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-3
          "
        >
          <div
            className="
              w-10
              h-10
              rounded-full
              border-2
              border-violet-500
              border-t-transparent
              animate-spin
            "
          />

          <span className="text-sm text-[#8b8aaa]">
            Carregando trilha…
          </span>
        </div>
      </div>
    );
  }


  return (
    <div
      className="
        flex-1
        overflow-y-auto
        pb-24
      "
    >

      <div
        className="
          sticky
          top-0
          z-10
          px-5
          pt-10
          pb-5
        "
        style={{
          background:
            'linear-gradient(to bottom, #0b0b18 80%, transparent)',
        }}
      >
        <button
          type="button"
          onClick={() =>
            setPhase('picker')
          }
          className="
            flex
            items-center
            gap-1.5
            text-[#8b8aaa]
            hover:text-white
            transition-colors
            mb-3
          "
        >
          <ArrowLeft size={16} />

          <span className="text-sm">
            Matérias
          </span>
        </button>

        <div
          className="
            flex
            items-center
            justify-between
            mb-1
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span className="text-2xl">
              {subjectInfo.emoji}
            </span>

            <h1
              className="
                font-['Outfit']
                text-xl
                font-bold
                text-white
              "
            >
              {subjectInfo.label}
            </h1>
          </div>

          <div
            className="
              flex
              items-center
              gap-1.5
              px-3
              py-1.5
              rounded-full
            "
            style={{
              background:
                'rgba(245,158,11,0.15)',
            }}
          >
            <Star
              size={13}
              className="
                text-amber-400
                fill-amber-400
              "
            />

            <span
              className="
                text-amber-400
                font-semibold
                text-sm
                font-['Outfit']
              "
            >
              {progress.totalScore} pts
            </span>
          </div>
        </div>

        <p className="text-xs text-[#8b8aaa]">
          {
            progress.completedVideoIds.filter(
              (id) =>
                nodes.find(
                  (n) => n.id === id
                )
            ).length
          }
          /{nodes.length} concluídos
        </p>

        <div
          className="
            mt-3
            h-1.5
            rounded-full
            overflow-hidden
          "
          style={{
            background: '#1e1e3a',
          }}
        >
          <div
            className="
              h-full
              rounded-full
              transition-all
              duration-500
            "
            style={{
              width:
                nodes.length
                  ? `${
                      (
                        progress.completedVideoIds.filter(
                          (id) =>
                            nodes.find(
                              (n) =>
                                n.id === id
                            )
                        ).length /
                        nodes.length
                      ) * 100
                    }%`
                  : '0%',
              background:
                `linear-gradient(to right, ${subjectInfo.color}, #06b6d4)`,
            }}
          />
        </div>
      </div>

      {nodes.length === 0 ? (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            px-5
            py-20
            text-center
          "
        >
          <span className="text-5xl mb-4">
            📭
          </span>

          <p
            className="
              text-[#8b8aaa]
              text-sm
            "
          >
            Nenhum vídeo disponível para
            esta matéria ainda.
          </p>
        </div>
      ) : (

        <div
          className="
            flex
            flex-col
            items-center
            px-4
            gap-0
            pb-4
          "
        >
          {nodes.map(
            (node, index) => {
              const isLeft =
                index % 2 === 0;

              const { status } =
                node;

              return (
                <div
                  key={node.id}
                  className="
                    flex
                    flex-col
                    items-center
                    w-full
                    max-w-xs
                  "
                >
                  {index > 0 && (
                    <div
                      className="
                        w-0.5
                        h-10
                      "
                      style={{
                        background:
                          nodes[
                            index - 1
                          ].status ===
                          'completed'
                            ? `linear-gradient(to bottom, ${subjectInfo.color}, #5b21b6)`
                            : '#2a2a4a',
                      }}
                    />
                  )}

                  <div
                    className={`
                      flex
                      items-center
                      w-full
                      ${
                        isLeft
                          ? 'justify-start pl-8'
                          : 'justify-end pr-8'
                      }
                    `}
                  >
                    {!isLeft && (
                      <div
                        className="
                          flex-1
                          mr-4
                          text-right
                        "
                        style={{
                          opacity:
                            status ===
                            'locked'
                              ? 0.4
                              : 1,
                        }}
                      >
                        <p
                          className="
                            text-xs
                            font-semibold
                            font-['Outfit']
                          "
                          style={{
                            color:
                              subjectInfo.color,
                          }}
                        >
                          #{node.order}
                        </p>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-white
                            leading-tight
                            line-clamp-2
                          "
                        >
                          {node.title}
                        </p>

                        <p
                          className="
                            text-xs
                            text-[#8b8aaa]
                            mt-0.5
                          "
                        >
                          {node.category}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        status !==
                          'locked' &&
                        setSelected(node)
                      }
                      disabled={
                        status ===
                        'locked'
                      }
                      className="
                        relative
                        flex-shrink-0
                        w-16
                        h-16
                        rounded-full
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-200
                        active:scale-95
                      "
                      style={
                        status ===
                        'completed'
                          ? {
                              background:
                                'linear-gradient(135deg, #10b981, #059669)',
                              boxShadow:
                                '0 0 0 4px rgba(16,185,129,0.2), 0 4px 20px rgba(16,185,129,0.3)',
                            }
                          : status ===
                            'available'
                          ? {
                              background:
                                `linear-gradient(135deg, ${subjectInfo.color}, #5b21b6)`,
                              boxShadow:
                                `0 0 0 4px ${subjectInfo.color}33, 0 4px 20px ${subjectInfo.color}44`,
                            }
                          : {
                              background:
                                '#1e1e3a',
                              border:
                                '2px solid #2a2a4a',
                              cursor:
                                'not-allowed',
                            }
                      }
                    >
                      {status ===
                      'completed' ? (
                        <CheckCircle
                          size={26}
                          className="text-white"
                        />
                      ) : status ===
                        'available' ? (
                        <PlayCircle
                          size={26}
                          className="text-white"
                        />
                      ) : (
                        <Lock
                          size={20}
                          className="
                            text-[#4e4d6a]
                          "
                        />
                      )}

                      {status ===
                        'available' && (
                        <span
                          className="
                            absolute
                            -top-1
                            -right-1
                            w-4
                            h-4
                            rounded-full
                            animate-ping
                          "
                          style={{
                            background:
                              '#06b6d4',
                            opacity: 0.6,
                          }}
                        />
                      )}
                    </button>

                    {isLeft && (
                      <div
                        className="
                          flex-1
                          ml-4
                        "
                        style={{
                          opacity:
                            status ===
                            'locked'
                              ? 0.4
                              : 1,
                        }}
                      >
                        <p
                          className="
                            text-xs
                            font-semibold
                            font-['Outfit']
                          "
                          style={{
                            color:
                              subjectInfo.color,
                          }}
                        >
                          #{node.order}
                        </p>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-white
                            leading-tight
                            line-clamp-2
                          "
                        >
                          {node.title}
                        </p>

                        <p
                          className="
                            text-xs
                            text-[#8b8aaa]
                            mt-0.5
                          "
                        >
                          {node.category}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}

          <div
            className="
              w-0.5
              h-10
              mt-0
            "
            style={{
              background:
                '#2a2a4a',
            }}
          />

          <div
            className="
              w-12
              h-12
              rounded-full
              flex
              items-center
              justify-center
              text-2xl
            "
            style={{
              background:
                '#1e1e3a',

              border:
                '2px dashed #2a2a4a',
            }}
          >
            🏆
          </div>

          <p
            className="
              text-xs
              text-[#4e4d6a]
              mt-2
              font-['Outfit']
            "
          >
            Meta Final
          </p>
        </div>
      )}

      {selected && (
        <VideoModal
          node={selected}
          onClose={() =>
            setSelected(null)
          }
        />
      )}
    </div>
  );
}
