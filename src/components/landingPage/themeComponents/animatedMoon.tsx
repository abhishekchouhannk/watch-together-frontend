import { useEffect, useState } from 'react';

export default function AnimatedMoon({ zIndex }: { zIndex: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed transition-all duration-[1800ms] ease-out ${
        isVisible ? 'top-[12vh] opacity-100' : '-top-40 opacity-0'
      }`}
      style={{ zIndex, left: '80%', transform: 'translateX(-50%)' }}
    >
      <div className="relative w-28 h-28 animate-slow-pulse-moon">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full blur-3xl bg-slate-300/20" />

        {/* Main moon body */}
        <div
          className="absolute inset-0 rounded-[25%] bg-gradient-to-br from-slate-200 to-slate-400 shadow-[0_0_40px_10px_rgba(190,210,255,0.25)] overflow-hidden"
          style={{
            clipPath:
              'polygon(0% 15%, 10% 0%, 90% 0%, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0% 85%)', // gentle blocky edges
          }}
        >
          {/* Craters */}
          <div className="absolute left-[30%] top-[30%] w-5 h-5 bg-slate-500/40 rounded-sm" />
          <div className="absolute left-[60%] top-[50%] w-4 h-4 bg-slate-500/30 rounded-[3px]" />
          <div className="absolute left-[40%] top-[70%] w-3 h-3 bg-slate-500/25 rounded-[2px]" />
          <div className="absolute left-[65%] top-[25%] w-3 h-3 bg-slate-500/25 rounded-[2px]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slow-pulse-moon {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.15);
          }
        }
        .animate-slow-pulse-moon {
          animation: slow-pulse-moon 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
