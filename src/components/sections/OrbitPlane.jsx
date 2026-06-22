'use client';

const CX = 170, CY = 150, RX = 130, RY = 48, TILT_DEG = -18;

function ellipsePath(cx, cy, rx, ry, tiltDeg) {
  const t = (tiltDeg * Math.PI) / 180;
  const cos = Math.cos(t), sin = Math.sin(t);
  const p0x = cx + rx * cos, p0y = cy + rx * sin;
  const p1x = cx - rx * cos, p1y = cy - rx * sin;
  return `M ${p0x},${p0y} A ${rx},${ry} ${tiltDeg} 1 1 ${p1x},${p1y} A ${rx},${ry} ${tiltDeg} 1 1 ${p0x},${p0y}`;
}

const ORBIT_PATH = ellipsePath(CX, CY, RX, RY, TILT_DEG);
const SPEED_MAP = { slow: 18, normal: 9, fast: 4 };

const TRAIL = [
  { lag: 0.05,  r: 6,   opacity: 0.42 },
  { lag: 0.10,  r: 4,   opacity: 0.28 },
  { lag: 0.16,  r: 2.5, opacity: 0.18 },
  { lag: 0.22,  r: 1.5, opacity: 0.10 },
];

export default function OrbitPlane({ className = '', size = 340, speed = 'normal', paused = false }) {
  const durSec = SPEED_MAP[speed] ?? SPEED_MAP.normal;
  const dur = `${durSec}s`;
  const playState = paused ? 'paused' : 'running';

  const enginePulse = `enginePulse ${1.4}s ease-in-out infinite`;
  const wingFlash   = `wingFlash 3s ease-in-out infinite`;

  return (
    <>
      <style>{`
        @keyframes enginePulse { 0%,100%{opacity:.55} 50%{opacity:.9} }
        @keyframes wingFlash   { 0%,100%{opacity:0} 45%,55%{opacity:.7} }
      `}</style>
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size, zIndex: 2 }}
      >
        {/* Orbit track + plane only — rendered above whatever globe sits behind this component */}
        <svg
          viewBox="0 0 340 300"
          className="pointer-events-none absolute inset-0 overflow-visible"
          style={{ width: size, height: size }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="op-track-fade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#fff" stopOpacity="0.03" />
              <stop offset="35%"  stopColor="#fff" stopOpacity="0.50" />
              <stop offset="68%"  stopColor="#fff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <path
            id="op-orbit-track"
            d={ORBIT_PATH}
            fill="none"
            stroke="url(#op-track-fade)"
            strokeWidth="1.4"
            strokeDasharray="4 9"
          />

          {/* Trail dots */}
          {TRAIL.map(({ lag, r, opacity }, i) => (
            <circle key={i} r={r} fill="#ffffff" opacity={opacity}>
              <animateMotion
                dur={dur}
                repeatCount="indefinite"
                begin={`${-(durSec * lag).toFixed(2)}s`}
                rotate="auto"
                calcMode="linear"
                keyTimes="0;0.46;0.58;1"
                keyPoints="0;0.46;0.46;1"
                style={{ animationPlayState: playState }}
              >
                <mpath href="#op-orbit-track" />
              </animateMotion>
            </circle>
          ))}

          {/* Plane — cruises, pauses mid-orbit for a beat, then continues (reads more like a real flight than a constant spin) */}
          <g>
            <animateMotion
              dur={dur}
              repeatCount="indefinite"
              rotate="auto"
              calcMode="linear"
              keyTimes="0;0.46;0.58;1"
              keyPoints="0;0.46;0.46;1"
              style={{ animationPlayState: playState }}
            >
              <mpath href="#op-orbit-track" />
            </animateMotion>
            {/* rotate(90) aligns nose forward along orbit tangent (icon is drawn nose-up) */}
            <g transform="rotate(90)">
              <PlaneIcon enginePulse={enginePulse} wingFlash={wingFlash} paused={paused} />
            </g>
          </g>
        </svg>
      </div>
    </>
  );
}

function PlaneIcon({ enginePulse, wingFlash, paused }) {
  const ps = paused ? 'paused' : 'running';
  return (
    <g transform="translate(-26,-26)">
      <svg width="52" height="52" viewBox="-26 -26 52 52">
        <defs>
          <radialGradient id="op-body-g" cx="40%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="100%" stopColor="#dbe6f8" />
          </radialGradient>
          <radialGradient id="op-wing-g" cx="50%" cy="20%" r="80%">
            <stop offset="0%"   stopColor="#eef3fc" />
            <stop offset="100%" stopColor="#c2d2ec" />
          </radialGradient>
          <filter id="op-pf" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g filter="url(#op-pf)">
          {/* Fuselage — tapered nose (top) to tapered tail (bottom) */}
          <path
            d="M 0,-24 C 2,-24 3.3,-19 3.5,-12 L 3.7,14 C 3.7,19 2,23 0,24.5 C -2,23 -3.7,19 -3.7,14 L -3.5,-12 C -3.3,-19 -2,-24 0,-24 Z"
            fill="url(#op-body-g)" stroke="#1B2B6B" strokeWidth="1"
          />
          {/* Main swept wings — root just aft of centre, sweeping back toward the tail */}
          <path d="M -1.5,0 L -20,12 L -21.5,14.5 L -3.3,9 Z" fill="url(#op-wing-g)" stroke="#1B2B6B" strokeWidth="1" />
          <path d="M  1.5,0 L  20,12 L  21.5,14.5 L  3.3,9 Z" fill="url(#op-wing-g)" stroke="#1B2B6B" strokeWidth="1" />
          {/* Engine nacelles, slung under each wing */}
          <rect x="-15.5" y="9.5" width="6.5" height="3.2" rx="1.6" fill="#b0c8e8" stroke="#1B2B6B" strokeWidth=".6"
            style={{ animation: enginePulse, animationPlayState: ps }} />
          <rect x="9"     y="9.5" width="6.5" height="3.2" rx="1.6" fill="#b0c8e8" stroke="#1B2B6B" strokeWidth=".6"
            style={{ animation: enginePulse, animationDelay: '.7s', animationPlayState: ps }} />
          {/* Horizontal tail stabilisers, at the rear */}
          <path d="M -1.2,17.5 L -8.5,21.5 L -9.5,23 L -1.8,20 Z" fill="url(#op-wing-g)" stroke="#1B2B6B" strokeWidth=".8" />
          <path d="M  1.2,17.5 L  8.5,21.5 L  9.5,23 L  1.8,20 Z" fill="url(#op-wing-g)" stroke="#1B2B6B" strokeWidth=".8" />
          {/* Vertical tail fin, at the rear */}
          <path d="M 0,15 C 1,18 2.6,21.5 1.4,22 L -1.4,22 C -2.6,21.5 -1,18 0,15 Z" fill="url(#op-body-g)" stroke="#1B2B6B" strokeWidth=".6" />
          {/* Cockpit */}
          <ellipse cx="0" cy="-18.5" rx="2"   ry="2.8" fill="#6090c0" opacity=".7" />
          <ellipse cx="0" cy="-18.5" rx=".8"  ry="1.2" fill="#90c0f0" opacity=".5" />
          {/* Cabin windows */}
          <rect x="-2.2" y="-13"   width="4.4" height="1.4" rx=".7" fill="#7090b8" opacity=".45" />
          <rect x="-2.2" y="-9.8"  width="4.4" height="1.4" rx=".7" fill="#7090b8" opacity=".45" />
          <rect x="-2.2" y="-6.6"  width="4.4" height="1.4" rx=".7" fill="#7090b8" opacity=".45" />
          <rect x="-2.2" y="-3.4"  width="4.4" height="1.4" rx=".7" fill="#7090b8" opacity=".4" />
          <rect x="-2.2" y="-0.2"  width="4.4" height="1.4" rx=".7" fill="#7090b8" opacity=".35" />
          {/* Wingtip nav lights */}
          <circle cx="-21" cy="14" r="1.2" fill="#ff4444"
            style={{ animation: wingFlash, animationPlayState: ps }} />
          <circle cx="21"  cy="14" r="1.2" fill="#44cc44"
            style={{ animation: wingFlash, animationDelay: '1.5s', animationPlayState: ps }} />
          {/* Engine glow */}
          <ellipse cx="-12.3" cy="13.5" rx="1.8" ry="1" fill="#a0e0ff" opacity=".35" />
          <ellipse cx="12.3"  cy="13.5" rx="1.8" ry="1" fill="#a0e0ff" opacity=".35" />
        </g>
      </svg>
    </g>
  );
}

