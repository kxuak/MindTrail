import { NavLink } from 'react-router';
import { Medal, MessageCircle, Route, KeyRound, HeartPulse } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Trilha', Icon: Route },
  { to: '/ranking', label: 'Ranking', Icon: Medal },
  { to: '/ia', label: 'IA', Icon: MessageCircle },
  { to: '/escape', label: 'Escape', Icon: KeyRound },
  { to: '/saude', label: 'Saúde', Icon: HeartPulse },
];

export function BottomNav() {
  return (
    <nav
      className="sticky top-0 left-0 right-0 z-50 w-full"
      style={{
        background: 'rgba(20, 20, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="hidden md:flex items-center text-violet-400 font-bold text-xl font-['Outfit']">
          MindTrail
        </div>

      
        <div className="flex items-stretch justify-between w-full md:w-auto md:gap-2">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
              
                `flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 flex-1 md:flex-none py-2.5 md:py-4 md:px-4 transition-all duration-200 ${
                  isActive ? 'text-violet-400' : 'text-[#4e4d6a] hover:text-[#8b8aaa]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1.5 rounded-xl transition-all duration-200 ${
                      isActive ? 'bg-violet-500/20' : ''
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  {/* 6. Fonte maior no PC (md:text-sm) */}
                  <span className="text-[10px] md:text-sm font-medium tracking-wide font-['Outfit'] whitespace-nowrap">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        
      </div>
    </nav>
  );
}