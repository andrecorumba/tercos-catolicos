const { useState, useEffect, useMemo, useRef } = React;

function RosaryCanvas({ beads, currentId, onBeadClick, chainPath, material, nightMode }) {
  const materials = {
    madeira: {
      grad: [['0%', '#6b4423'], ['35%', '#3a2416'], ['100%', '#0f0803']],
      active: [['0%', '#f4d789'], ['40%', '#c28a3a'], ['100%', '#5a3710']],
      done: [['0%', '#8a6a3e'], ['40%', '#4a3620'], ['100%', '#1a0f07']],
      stroke: '#0f0803',
      highlight: 0.15
    },
    madreperola: {
      grad: [['0%', '#ffffff'], ['40%', '#f0e4d8'], ['100%', '#b8a88f']],
      active: [['0%', '#fff4c8'], ['40%', '#f4d789'], ['100%', '#a88234']],
      done: [['0%', '#ede4d0'], ['50%', '#cbb98f'], ['100%', '#8a7550']],
      stroke: '#8a7550',
      highlight: 0.5
    },
    cristal: {
      grad: [['0%', '#ffffff'], ['40%', '#d4e8ff'], ['100%', '#7f9fc4']],
      active: [['0%', '#fff6c0'], ['40%', '#f0c870'], ['100%', '#7a5a20']],
      done: [['0%', '#e8eef5'], ['50%', '#a8b8cc'], ['100%', '#5a6f8a']],
      stroke: '#4a5a70',
      highlight: 0.65
    },
    pedra: {
      grad: [['0%', '#3a3a42'], ['40%', '#1a1a1e'], ['100%', '#050506']],
      active: [['0%', '#f4d789'], ['40%', '#c28a3a'], ['100%', '#3a2410']],
      done: [['0%', '#4a4a52'], ['50%', '#2a2a30'], ['100%', '#0a0a0c']],
      stroke: '#050506',
      highlight: 0.25
    },
    metal: {
      grad: [['0%', '#f4d789'], ['40%', '#a88234'], ['100%', '#4a3410']],
      active: [['0%', '#fff8d0'], ['40%', '#f4d789'], ['100%', '#8a5a14']],
      done: [['0%', '#8a6f40'], ['50%', '#5a4520'], ['100%', '#2a1f08']],
      stroke: '#2a1f08',
      highlight: 0.4
    }
  };
  const m = materials[material] || materials.madeira;
  const grad = (id, stops) => (
    <radialGradient id={id} cx="35%" cy="30%" r="70%">
      {stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
    </radialGradient>
  );

  const surfaceTone = nightMode
    ? { bg: '#0a0604', veins: '#1a100a', vein2: '#050301' }
    : { bg: '#2a1a10', veins: '#3a2416', vein2: '#1a0f07' };

  return (
    <svg viewBox="0 0 1000 1100" className="rosary-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="beadShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
          <feOffset dx="2" dy="4" result="offsetblur" />
          <feComponentTransfer><feFuncA type="linear" slope="0.55" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {grad('beadGradient', m.grad)}
        {grad('beadGradientActive', m.active)}
        {grad('beadGradientDone', m.done)}
        <linearGradient id="crossWood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a3016" />
          <stop offset="50%" stopColor="#2a1708" />
          <stop offset="100%" stopColor="#1a0e05" />
        </linearGradient>
        <radialGradient id="medalGold" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f4d789" />
          <stop offset="50%" stopColor="#a88234" />
          <stop offset="100%" stopColor="#5a3710" />
        </radialGradient>
        <pattern id="woodSurface" patternUnits="userSpaceOnUse" width="1000" height="1100">
          <rect width="1000" height="1100" fill={surfaceTone.bg} />
          {Array.from({ length: 18 }).map((_, i) => (
            <path
              key={i}
              d={`M 0 ${i * 62 + (i % 2) * 8} Q 500 ${i * 62 + 10 + (i % 3) * 5} 1000 ${i * 62 + (i % 2) * 6}`}
              stroke={i % 3 === 0 ? surfaceTone.veins : surfaceTone.vein2}
              strokeWidth={i % 4 === 0 ? 1.5 : 0.8}
              fill="none"
              opacity={0.6}
            />
          ))}
        </pattern>
        <pattern id="linen" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill={nightMode ? '#3a3224' : '#d9cba3'} />
          <path d="M0 0 L8 0 M0 4 L8 4" stroke={nightMode ? '#2a2418' : '#c3b488'} strokeWidth="0.4" opacity="0.6" />
          <path d="M0 0 L0 8 M4 0 L4 8" stroke={nightMode ? '#1a1510' : '#b8a678'} strokeWidth="0.4" opacity="0.5" />
        </pattern>
        <radialGradient id="linenVignette" cx="50%" cy="50%" r="60%">
          {nightMode ? (
            <>
              <stop offset="0%" stopColor="#4a3f28" />
              <stop offset="70%" stopColor="#2a2318" />
              <stop offset="100%" stopColor="#0e0b06" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#e5d7a8" />
              <stop offset="70%" stopColor="#c9b985" />
              <stop offset="100%" stopColor="#8c7d54" />
            </>
          )}
        </radialGradient>
        <radialGradient id="activeHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#c28a3a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c28a3a" stopOpacity="0" />
        </radialGradient>
        {/* luz de vela no canto */}
        <radialGradient id="candleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#c28a3a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c28a3a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1000" height="1100" fill="url(#woodSurface)" />

      {/* Luz ambiente da vela quando nightMode */}
      {nightMode && (
        <circle cx="120" cy="900" r="400" fill="url(#candleGlow)" className="candle-ambient" />
      )}

      <g filter="url(#beadShadow)">
        <path
          d="M 80 120 Q 180 80 300 100 Q 450 70 600 95 Q 780 80 920 130 L 930 970 Q 820 1010 680 990 Q 500 1020 340 995 Q 180 1015 80 970 Z"
          fill="url(#linenVignette)"
          opacity="0.95"
        />
        <path
          d="M 80 120 Q 180 80 300 100 Q 450 70 600 95 Q 780 80 920 130 L 930 970 Q 820 1010 680 990 Q 500 1020 340 995 Q 180 1015 80 970 Z"
          fill="url(#linen)"
          opacity="0.35"
        />
        <path d="M 150 300 Q 500 280 870 320" stroke={nightMode ? '#6a5a38' : '#a8965f'} strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M 120 600 Q 500 620 880 590" stroke={nightMode ? '#6a5a38' : '#a8965f'} strokeWidth="1" fill="none" opacity="0.35" />
      </g>

      <path d={chainPath} stroke={nightMode ? '#1a1208' : '#2a1708'} strokeWidth="1.8" fill="none" opacity="0.85" filter="url(#beadShadow)" />

      {beads.map((b) => {
        const isActive = b.id === currentId;
        const isDone = b.id < currentId;
        const isCross = b.type === 'cross';
        const isMedal = b.type === 'medal';
        const isPater = b.type === 'pater';
        let r = 11;
        if (isPater) r = 16;
        if (isMedal) r = 22;
        let fill = 'url(#beadGradient)';
        if (isActive) fill = 'url(#beadGradientActive)';
        else if (isDone) fill = 'url(#beadGradientDone)';
        if (isMedal) fill = 'url(#medalGold)';

        if (isCross) {
          return (
            <g key={b.id} onClick={() => onBeadClick(b.id)} style={{ cursor: 'pointer' }} filter="url(#beadShadow)">
              {isActive && <circle cx={b.x} cy={b.y + 20} r={55} fill="url(#activeHalo)" className="halo" />}
              <rect x={b.x - 6} y={b.y - 10} width={12} height={78} fill="url(#crossWood)" rx={1} />
              <rect x={b.x - 26} y={b.y + 14} width={52} height={11} fill="url(#crossWood)" rx={1} />
              <circle cx={b.x} cy={b.y + 22} r={3} fill="#a88234" opacity="0.6" />
              <rect x={b.x - 6} y={b.y - 14} width={12} height={4} fill="#a88234" opacity="0.7" />
            </g>
          );
        }
        if (isMedal) {
          return (
            <g key={b.id} onClick={() => onBeadClick(b.id)} style={{ cursor: 'pointer' }} filter="url(#beadShadow)">
              {isActive && <circle cx={b.x} cy={b.y} r={48} fill="url(#activeHalo)" className="halo" />}
              <circle cx={b.x} cy={b.y} r={r} fill={fill} stroke="#5a3710" strokeWidth="1" />
              <circle cx={b.x} cy={b.y} r={r - 4} fill="none" stroke="#8a6a2e" strokeWidth="0.6" />
              <text x={b.x} y={b.y + 5} textAnchor="middle" fontFamily="Cinzel, serif" fontSize="14" fontWeight="600" fill="#3a2410" opacity="0.75">M</text>
            </g>
          );
        }
        return (
          <g key={b.id} onClick={() => onBeadClick(b.id)} style={{ cursor: 'pointer' }} filter="url(#beadShadow)">
            {isActive && <circle cx={b.x} cy={b.y} r={r + 20} fill="url(#activeHalo)" className="halo" />}
            <circle cx={b.x} cy={b.y} r={r} fill={fill} stroke={m.stroke} strokeWidth="0.8" />
            <ellipse cx={b.x - r * 0.35} cy={b.y - r * 0.4} rx={r * 0.3} ry={r * 0.18} fill="#fff" opacity={isActive ? 0.55 : m.highlight} />
          </g>
        );
      })}
    </svg>
  );
}

window.RosaryCanvas = RosaryCanvas;
