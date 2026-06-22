'use client';

// Single rotated ellipse (SVG arc rotation baked into the path itself, no
// extra CSS transform layer) so the dashed track and the plane's motion
// path always line up pixel-for-pixel.
const CX = 150;
const CY = 150;
const RX = 170;
const RY = 65;
const TILT_DEG = -18;

function ellipsePath(cx, rx, ry, cy, tiltDeg) {
  const t = (tiltDeg * Math.PI) / 180;
  const cos = Math.cos(t);
  const sin = Math.sin(t);
  const p0x = cx + rx * cos;
  const p0y = cy + rx * sin;
  const p1x = cx - rx * cos;
  const p1y = cy - rx * sin;
  return `M ${p0x},${p0y} A ${rx},${ry} ${tiltDeg} 1 1 ${p1x},${p1y} A ${rx},${ry} ${tiltDeg} 1 1 ${p0x},${p0y}`;
}

const ORBIT_PATH = ellipsePath(CX, RX, RY, CY, TILT_DEG);

export default function OrbitPlane({ className = '', size = 300, duration = '9s' }) {
  return (
    <svg
      viewBox="0 0 300 300"
      className={`pointer-events-none absolute top-1/2 left-1/2 overflow-visible ${className}`}
      style={{ width: size, height: size, transform: 'translate(-50%, -50%)' }}
    >
      <defs>
        <linearGradient id="orbitFade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path id="orbit-track" d={ORBIT_PATH} fill="none" stroke="url(#orbitFade)" strokeWidth="1.5" strokeDasharray="3 7" />

      {/* faint trailing comet behind the plane */}
      <circle r="3" fill="#ffffff" opacity="0.35">
        <animateMotion dur={duration} repeatCount="indefinite" begin="-0.3s" rotate="auto">
          <mpath href="#orbit-track" />
        </animateMotion>
      </circle>
      <circle r="2" fill="#ffffff" opacity="0.2">
        <animateMotion dur={duration} repeatCount="indefinite" begin="-0.6s" rotate="auto">
          <mpath href="#orbit-track" />
        </animateMotion>
      </circle>

      <g>
        <animateMotion dur={duration} repeatCount="indefinite" rotate="auto">
          <mpath href="#orbit-track" />
        </animateMotion>
        <g transform="rotate(90) scale(0.9)" filter="url(#planeGlow)">
          <path
            d="M0,-9 L2.2,-2 L9,3 L2,3 L0,9 L-2,3 L-9,3 L-2.2,-2 Z"
            fill="#ffffff"
          />
        </g>
      </g>

      <defs>
        <filter id="planeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
