import React from 'react';

export const TaazaaBackgroundLayer: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none print:hidden">
      
      {/* 1. Seamless Full-Screen Interconnected Hexagon Tessellation (Scaled to 30% Opacity) */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.07] dark:opacity-[0.10] text-teal-700 dark:text-[#29E8AE]" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Pattern with Shared-Edge Interconnected Hexagons */}
          <pattern 
            id="taazaa_hex_pattern" 
            width="120" 
            height="104" 
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            {/* Hexagon 1: Center (60, 52) Radius 32 */}
            <path 
              d="M60 20 L87.7 36 L87.7 68 L60 84 L32.3 68 L32.3 36 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
            />
            {/* Inner Isometric 3-Facet Y-lines (Taazaa brand logo mark geometry) */}
            <path 
              d="M60 52 L60 20 M60 52 L87.7 68 M60 52 L32.3 68" 
              stroke="currentColor" 
              strokeWidth="1.2" 
            />
            {/* Top-Facet Accent Fill in Taazaa Green */}
            <path 
              d="M60 20 L87.7 36 L60 52 L32.3 36 Z" 
              fill="#29E8AE" 
              fillOpacity="0.25" 
            />

            {/* Hexagon 2: Top-Left Shared Edge */}
            <path 
              d="M0 -32 L27.7 -16 L27.7 16 L0 32 L-27.7 16 L-27.7 -16 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
            />
            {/* Hexagon 3: Top-Right Shared Edge */}
            <path 
              d="M120 -32 L147.7 -16 L147.7 16 L120 32 L92.3 16 L92.3 -16 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
            />
            {/* Hexagon 4: Bottom-Left Shared Edge */}
            <path 
              d="M0 72 L27.7 88 L27.7 120 L0 136 L-27.7 120 L-27.7 88 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
            />
            {/* Hexagon 5: Bottom-Right Shared Edge */}
            <path 
              d="M120 72 L147.7 88 L147.7 120 L120 136 L92.3 120 L92.3 88 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
            />

            {/* Connecting Hexagon Side Junction Nodes */}
            <circle cx="60" cy="20" r="2.5" fill="#059669" className="dark:fill-[#29E8AE]" />
            <circle cx="87.7" cy="36" r="2" fill="#0D9488" className="dark:fill-[#29E8AE]" fillOpacity="0.9" />
            <circle cx="87.7" cy="68" r="2.5" fill="#059669" className="dark:fill-[#29E8AE]" />
            <circle cx="60" cy="84" r="2" fill="#0D9488" className="dark:fill-[#29E8AE]" fillOpacity="0.9" />
            <circle cx="32.3" cy="68" r="2.5" fill="#059669" className="dark:fill-[#29E8AE]" />
            <circle cx="32.3" cy="36" r="2" fill="#0D9488" className="dark:fill-[#29E8AE]" fillOpacity="0.9" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#taazaa_hex_pattern)" />
      </svg>

      {/* 2. Floating Multi-Sized Hexagon Clusters (Scaled to 30% Opacity) */}
      
      {/* Cluster 1: Top-Right Giant Hexagon System */}
      <div className="absolute -top-12 right-[-2%] sm:right-6 lg:right-16 w-[380px] sm:w-[560px] opacity-[0.14] dark:opacity-[0.15] transition-opacity">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Main Giant Hexagon */}
          <path d="M150 40 L220 80 L220 160 L150 200 L80 160 L80 80 Z" fill="#047857" fillOpacity="0.08" stroke="#059669" className="dark:stroke-[#29E8AE] dark:fill-[#07091E]" strokeWidth="2.5" />
          {/* Internal Isometric Facets */}
          <path d="M150 120 L150 40 M150 120 L220 160 M150 120 L80 160" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="2" />
          <path d="M150 40 L220 80 L150 120 L80 80 Z" fill="#29E8AE" fillOpacity="0.4" />
          <path d="M150 120 L220 80 V160 L150 200 Z" fill="#059669" fillOpacity="0.25" className="dark:fill-[#29E8AE]" />
          <path d="M80 80 L150 120 V200 L80 160 Z" fill="#07091E" fillOpacity="0.15" className="dark:fill-black" />

          {/* Connected Shared-Side Medium Hexagon Top-Right */}
          <path d="M150 40 L220 80 L220 0 L150 -40 L80 0 L80 40 Z" fill="none" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1.8" strokeDasharray="5 5" />
          
          {/* Connected Shared-Side Hexagon Bottom-Right */}
          <path d="M220 160 L290 200 L290 280 L220 320 L150 280 L150 200 Z" fill="#29E8AE" fillOpacity="0.18" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="2" />
          <path d="M220 240 L220 160 M220 240 L290 280 M220 240 L150 280" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1.5" />

          {/* Connected Shared-Side Small Hexagon Bottom-Left */}
          <path d="M150 200 L80 160 L30 190 L30 250 L80 280 L150 250 Z" fill="none" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1.8" />
          <path d="M80 220 L80 160 M80 220 L150 250 M80 220 L30 250" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1.2" />

          {/* Accent Glowing Vertices */}
          <circle cx="150" cy="40" r="4.5" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="220" cy="80" r="4" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="220" cy="160" r="4.5" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="150" cy="200" r="5" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="80" cy="160" r="4" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="80" cy="80" r="4.5" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="150" cy="120" r="3.5" fill="#29E8AE" className="dark:fill-white" />
        </svg>
      </div>

      {/* Cluster 2: Mid-Left Hexagon Chain */}
      <div className="absolute top-[34%] -left-10 sm:left-4 w-[300px] sm:w-[440px] opacity-[0.12] dark:opacity-[0.13] transition-opacity">
        <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Hexagon 1 */}
          <path d="M100 30 L150 60 L150 120 L100 150 L50 120 L50 60 Z" fill="#07091E" fillOpacity="0.1" stroke="#059669" className="dark:stroke-[#29E8AE] dark:fill-[#07091E]" strokeWidth="2.2" />
          <path d="M100 90 L100 30 M100 90 L150 120 M100 90 L50 120" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1.6" />
          <path d="M100 30 L150 60 L100 90 L50 60 Z" fill="#29E8AE" fillOpacity="0.3" />

          {/* Shared Edge Hexagon 2 (Right) */}
          <path d="M150 60 L200 90 L200 150 L150 180 L100 150 L150 120 Z" fill="none" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1.8" />
          <path d="M150 120 L150 60 M150 120 L200 150 M150 120 L100 150" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1.2" strokeOpacity="0.8" />

          {/* Shared Edge Hexagon 3 (Bottom) */}
          <path d="M100 150 L150 180 L150 240 L100 270 L50 240 L50 180 Z" fill="#29E8AE" fillOpacity="0.2" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1.8" />

          <circle cx="100" cy="30" r="3.5" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="150" cy="60" r="3.5" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="150" cy="120" r="4" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="100" cy="150" r="4" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="50" cy="120" r="3.5" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="50" cy="60" r="3.5" fill="#059669" className="dark:fill-[#29E8AE]" />
        </svg>
      </div>

      {/* Cluster 3: Bottom-Right Large Hexagon Cluster */}
      <div className="absolute bottom-6 right-4 sm:right-16 w-[320px] sm:w-[480px] opacity-[0.11] dark:opacity-[0.13] transition-opacity">
        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M140 40 L195 72 L195 136 L140 168 L85 136 L85 72 Z" fill="#07091E" fillOpacity="0.12" stroke="#059669" className="dark:stroke-[#29E8AE] dark:fill-[#07091E]" strokeWidth="2.4" />
          <path d="M140 104 L140 40 M140 104 L195 136 M140 104 L85 136" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1.8" />
          <path d="M140 40 L195 72 L140 104 L85 72 Z" fill="#29E8AE" fillOpacity="0.35" />
          <path d="M140 104 L195 72 V136 L140 168 Z" fill="#059669" fillOpacity="0.2" className="dark:fill-[#29E8AE]" />

          {/* Outer Ring */}
          <circle cx="140" cy="104" r="90" stroke="#059669" className="dark:stroke-[#29E8AE]" strokeWidth="1" strokeDasharray="6 6" opacity="0.6" />
          <circle cx="140" cy="40" r="4" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="195" cy="72" r="3.5" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="195" cy="136" r="4" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="140" cy="168" r="4.5" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="85" cy="136" r="4" fill="#059669" className="dark:fill-[#29E8AE]" />
          <circle cx="85" cy="72" r="3.5" fill="#059669" className="dark:fill-[#29E8AE]" />
        </svg>
      </div>

      {/* 3. Ambient Brand Radial Light Glows (Soft Subtle 30% Scale) */}
      <div 
        className="absolute -top-32 right-[-5%] w-[750px] h-[750px] rounded-full blur-[140px] opacity-[0.08] dark:opacity-[0.10]"
        style={{ background: 'radial-gradient(circle, #29E8AE 0%, rgba(6, 182, 212, 0.4) 50%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-10 left-[-10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-[0.06] dark:opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, #00D09C 0%, rgba(7, 9, 30, 0.6) 60%, transparent 75%)' }}
      />
    </div>
  );
};
