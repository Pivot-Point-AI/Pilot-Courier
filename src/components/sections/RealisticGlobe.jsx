'use client';

export default function RealisticGlobe({ className = '' }) {
  return (
    <div className={className}>
      {/* Soft outer halo so the disc blends into the sky instead of a hard cut */}
      <div
        className="absolute -inset-[22%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(180,210,255,0.45) 0%, rgba(180,210,255,0.18) 45%, rgba(180,210,255,0) 72%)' }}
      />

      {/* Earth sphere */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          backgroundImage: 'url(/images/earth-texture.jpg)',
          backgroundSize: '210% 100%',
          animation: 'globe-rotate 40s linear infinite',
          boxShadow:
            'inset -22px -18px 50px rgba(0,10,40,0.55), inset 16px 14px 35px rgba(255,255,255,0.35), 0 0 40px rgba(120,180,255,0.55)',
        }}
      />

      {/* Atmosphere glow rim */}
      <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.25), 0 0 35px rgba(150,200,255,0.45)' }} />

      {/* Orbit swoosh ring, drawn on top so it arcs across the face of the globe */}
      <svg
        className="absolute -inset-[28%] w-[156%] h-[156%] animate-[spin_14s_linear_infinite]"
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.9))' }}
      >
        <defs>
          <linearGradient id="orbitFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse
          cx="50"
          cy="50"
          rx="46"
          ry="14"
          fill="none"
          stroke="url(#orbitFade)"
          strokeWidth="1.2"
          transform="rotate(-20 50 50)"
        />
      </svg>

      <style>{`
        @keyframes globe-rotate {
          from { background-position: 0% 0%; }
          to { background-position: 100% 0%; }
        }
      `}</style>
    </div>
  );
}
