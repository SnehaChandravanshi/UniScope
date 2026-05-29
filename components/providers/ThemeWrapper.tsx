'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const isAuroraMode = useStore((state) => state.isAuroraMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const body = document.body;
    if (isAuroraMode) {
      html.classList.add('dark');
      body.className = "min-h-full flex flex-col bg-[#07080e] text-slate-100 transition-colors duration-500 relative overflow-x-hidden";
    } else {
      html.classList.remove('dark');
      body.className = "min-h-full flex flex-col bg-background text-foreground transition-colors duration-500";
    }
  }, [isAuroraMode, mounted]);

  return (
    <div className={`flex flex-col flex-grow relative ${isAuroraMode ? 'bg-[#07080e] text-slate-100' : ''}`}>
      {/* Aurora Ambient Backdrops (floating orbs) */}
      {isAuroraMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          <div className="absolute top-[5%] left-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-600/12 blur-[140px] animate-soft-pulse" />
          <div className="absolute top-[35%] right-[-15%] w-[650px] h-[650px] rounded-full bg-purple-600/8 blur-[160px] animate-soft-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[10%] left-[5%] w-[550px] h-[550px] rounded-full bg-indigo-500/8 blur-[130px] animate-soft-pulse" style={{ animationDelay: '4s' }} />
        </div>
      )}
      <div className="relative z-10 flex flex-col flex-grow">{children}</div>
    </div>
  );
}
export default ThemeWrapper;
