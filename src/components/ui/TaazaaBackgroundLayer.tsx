import React from 'react';

export const TaazaaBackgroundLayer: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none print:hidden">
      
      {/* Ambient Radial Gradient Orbs with Taazaa Mint (#29E8AE) and Deep Midnight Glow */}
      <div 
        className="absolute -top-40 right-[-10%] w-[800px] h-[800px] rounded-full blur-[140px] opacity-[0.14] dark:opacity-[0.20]"
        style={{ background: 'radial-gradient(circle, #29E8AE 0%, rgba(6, 182, 212, 0.4) 50%, transparent 70%)' }}
      />
      <div 
        className="absolute top-[40%] -left-48 w-[650px] h-[650px] rounded-full blur-[130px] opacity-[0.10] dark:opacity-[0.16]"
        style={{ background: 'radial-gradient(circle, #06B6D4 0%, rgba(41, 232, 174, 0.3) 50%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-10 right-[5%] w-[700px] h-[700px] rounded-full blur-[150px] opacity-[0.08] dark:opacity-[0.14]"
        style={{ background: 'radial-gradient(circle, #29E8AE 0%, rgba(99, 102, 241, 0.2) 60%, transparent 70%)' }}
      />

      {/* Hexagonal Isometric Geometric Watermarks (Taazaa 3-Facet Brand Mark Motif) */}
      
      {/* Large Top-Right Isometric Hexagon Watermark */}
      <svg 
        className="absolute top-12 right-6 lg:right-24 w-[380px] sm:w-[540px] h-auto opacity-[0.035] dark:opacity-[0.055] text-brand-400 transition-opacity duration-300" 
        viewBox="0 0 160 160" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Diamond */}
        <path d="M80 15L125 41L80 67L35 41L80 15Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Right Facet */}
        <path d="M80 67L125 41V93L80 119V67Z" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Left Facet */}
        <path d="M35 41L80 67V119L35 93V41Z" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Outer Accent Orbit Ring */}
        <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 6" opacity="0.6" />
      </svg>

      {/* Mid-Left Floating Hexagon Group */}
      <svg 
        className="absolute top-[48%] -left-12 w-[320px] sm:w-[420px] h-auto opacity-[0.03] dark:opacity-[0.045] text-brand-400" 
        viewBox="0 0 160 160" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M80 20L120 43L80 66L40 43L80 20Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
        <path d="M80 66L120 43V89L80 112V66Z" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M40 43L80 66V112L40 89V43Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Bottom-Right Geometry */}
      <svg 
        className="absolute bottom-24 right-10 w-[260px] sm:w-[360px] h-auto opacity-[0.025] dark:opacity-[0.04] text-brand-400" 
        viewBox="0 0 160 160" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M80 25L115 45L80 65L45 45L80 25Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" />
        <path d="M80 65L115 45V85L80 105V65Z" fill="currentColor" fillOpacity="0.75" stroke="currentColor" strokeWidth="1.2" />
        <path d="M45 45L80 65V105L45 85V45Z" fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      {/* Micro-dot matrix grid texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #29E8AE 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};
