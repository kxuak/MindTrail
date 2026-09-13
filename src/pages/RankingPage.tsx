import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { rankingService } from '../services/rankingService';
import { useAppContext } from '../context/AppContext';
import type { RankingUser } from '../types';

const podiumConfig = [
  { rank: 2, height: 'h-24', bg: 'from-slate-400 to-slate-500', glow: 'rgba(148,163,184,0.3)', crown: '🥈' },
  { rank: 1, height: 'h-32', bg: 'from-amber-400 to-amber-500', glow: 'rgba(245,158,11,0.4)', crown: '👑' },
  { rank: 3, height: 'h-20', bg: 'from-amber-700 to-amber-800', glow: 'rgba(180,83,9,0.3)', crown: '🥉' },
];

export function RankingPage() {
  const { progress } = useAppContext();
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rankingService.getRanking(progress.totalScore).then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, [progress.totalScore]);

  const top3 = users.slice(0, 3);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <style>{`
        .ranking-trophy {
          width: 40px;
          height: 40px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ranking-trophy-star {
          width: 30px;
          height: 30px;
          position: absolute;
          background: #efd510;
          animation: ranking-trophy-rot 3s infinite;
          box-shadow: 0 0 18px rgba(239,213,16,0.22);
        }

        .ranking-trophy-star::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          background: #efd510;
          transform: rotate(135deg);
        }

        .ranking-trophy-icon {
          position: absolute;
          width: 30px;
          height: 30px;
          fill: #e94822;
          z-index: 1;
        }

        @keyframes ranking-trophy-rot {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(340deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

      <div className="w-full flex flex-col items-center justify-center pt-10 pb-7 px-5">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="ranking-trophy" aria-hidden="true">
            <div className="ranking-trophy-star" />
            <svg
              className="ranking-trophy-icon"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M62.11,53.93c22.582-3.125,22.304-23.471,18.152-29.929-4.166-6.444-10.36-2.153-10.36-2.153v-4.166H30.099v4.166s-6.194-4.291-10.36,2.153c-4.152,6.458-4.43,26.804,18.152,29.929l5.236,7.777v8.249s-.944,4.597-4.833,4.986c-3.903,.389-7.791,4.028-7.791,7.374h38.997c0-3.347-3.889-6.986-7.791-7.374-3.889-.389-4.833-4.986-4.833-4.986v-8.249l5.236-7.777Zm7.388-24.818s2.833-3.097,5.111-1.347c2.292,1.75,2.292,15.86-8.999,18.138l3.889-16.791Zm-44.108-1.347c2.278-1.75,5.111,1.347,5.111,1.347l3.889,16.791c-11.291-2.278-11.291-16.388-8.999-18.138Z" />
            </svg>
          </div>

          <h1 className="font-['Outfit'] text-3xl font-bold text-white tracking-tight">
            Ranking
          </h1>
        </div>

        <p className="text-sm text-[#aaa8c7] text-center font-medium">
          Top alunos da trilha esta semana
        </p>
      </div>

      <div className="px-5 mb-8">
        <div
          className="rounded-2xl p-6 pb-0"
          style={{
            background: 'linear-gradient(135deg, #14142a, #1e1e3a)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <div className="flex items-end justify-center gap-4">
            {podiumConfig.map(({ rank, height, bg, glow, crown }) => {
              const user = podiumOrder.find((_, i) => [2, 1, 3][i] === rank);
              if (!user) return null;
              const isFirst = rank === 1;

              return (
                <div key={rank} className="flex flex-col items-center">
                  <div className="relative mb-2">
                    {isFirst && (
                      <Crown
                        size={20}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 fill-amber-400"
                      />
                    )}

                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${isFirst ? 'w-16 h-16' : ''}`}
                      style={{
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.3))',
                        border: '2px solid rgba(124,58,237,0.4)',
                        boxShadow: `0 0 20px ${glow}`,
                      }}
                    >
                      {user.emoji}
                    </div>

                    <span
                      className="absolute -bottom-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                      style={{
                        background: '#0b0b18',
                        color: '#a78bfa',
                        border: '1px solid rgba(124,58,237,0.4)',
                      }}
                    >
                      {rank}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white text-center w-16 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-[#8b8aaa] mb-2">{user.score} pts</p>

                  <div
                    className={`w-20 ${height} rounded-t-xl flex items-start justify-center pt-2 bg-gradient-to-b ${bg} relative`}
                  >
                    <span className="text-xl">{crown}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-2">
        {users.map((user, i) => {
          const isCurrentUser = user.id === 'current';

          return (
            <div
              key={user.id}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
              style={{
                background: isCurrentUser ? 'rgba(124,58,237,0.15)' : 'rgba(30,30,58,0.6)',
                border: isCurrentUser
                  ? '1px solid rgba(124,58,237,0.4)'
                  : '1px solid rgba(42,42,74,0.8)',
              }}
            >
              <span
                className="text-sm font-bold w-7 text-center font-['Outfit']"
                style={{ color: i < 3 ? '#f59e0b' : '#4e4d6a' }}
              >
                {i + 1}
              </span>

              <span className="text-xl">{user.emoji}</span>

              <span className="flex-1 text-sm font-semibold text-white">
                {user.name}
                {isCurrentUser && (
                  <span
                    className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(124,58,237,0.3)', color: '#a78bfa' }}
                  >
                    você
                  </span>
                )}
              </span>

              <div className="text-right">
                <p className="text-sm font-semibold text-[#a78bfa] font-['Outfit']">
                  {user.score} pts
                </p>
                <p className="text-xs text-[#4e4d6a]">{user.completedVideos} vídeos</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
