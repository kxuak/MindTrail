import { Outlet, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';
import { BottomNav } from './BottomNav';
import { AppProvider } from '../context/AppContext';

export function Layout() {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <AppProvider>
     
      <div className="flex flex-col h-screen w-full relative overflow-hidden rain-pattern">
        
        <BottomNav />
        
        <main
          ref={mainRef}
          className="flex-1 flex flex-col overflow-y-auto relative z-10"
          style={{ minHeight: 0 }}
        >
          <div className="max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>

      </div>
    </AppProvider>
  );
}
