export default function IAFCrest({ className = 'w-64 h-64' }) {
  return (
    <svg viewBox="0 0 400 480" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Golden gradients */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#eab308" />
          <stop offset="70%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>

        <linearGradient id="goldLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>

        <radialGradient id="skyBlueRing" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="85%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#075985" />
        </radialGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ── 1. ASHOKA LION CAPITAL (TOP) ─────────────────────────── */}
      <g id="ashoka-capital" transform="translate(160, 20)">
        {/* Base Pedestal */}
        <rect x="15" y="88" width="50" height="7" rx="2" fill="url(#goldLight)" stroke="#78350f" strokeWidth="1" />
        <ellipse cx="40" cy="85" rx="30" ry="5" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="1" />
        {/* Small Ashoka Chakra on pedestal */}
        <circle cx="40" cy="85" r="4" fill="none" stroke="#1e3a8a" strokeWidth="1" />

        {/* Center Lion Head */}
        <path d="M30,30 Q40,15 50,30 Q58,45 52,65 Q40,75 28,65 Q22,45 30,30 Z" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="1.2" />
        <circle cx="36" cy="38" r="2" fill="#451a03" />
        <circle cx="44" cy="38" r="2" fill="#451a03" />
        <path d="M38,44 Q40,46 42,44" fill="none" stroke="#451a03" strokeWidth="1" />
        {/* Mane Details */}
        <path d="M25,38 Q18,50 24,62 M55,38 Q62,50 56,62 M32,22 Q40,12 48,22" fill="none" stroke="url(#goldLight)" strokeWidth="1.5" />

        {/* Left Lion Profile */}
        <path d="M22,34 Q10,40 16,56 Q24,66 28,62 Q20,48 22,34 Z" fill="url(#goldLight)" stroke="#78350f" strokeWidth="1" />
        <circle cx="17" cy="42" r="1.5" fill="#451a03" />

        {/* Right Lion Profile */}
        <path d="M58,34 Q70,40 64,56 Q56,66 52,62 Q60,48 58,34 Z" fill="url(#goldLight)" stroke="#78350f" strokeWidth="1" />
        <circle cx="63" cy="42" r="1.5" fill="#451a03" />

        {/* Crown Detail */}
        <polygon points="32,20 40,8 48,20" fill="url(#goldLight)" stroke="#78350f" strokeWidth="0.8" />
      </g>

      {/* ── 2. SKY-BLUE CHAKRA RING ──────────────────────────────── */}
      <g id="chakra-ring" transform="translate(200, 245)">
        {/* Outer Gold Border */}
        <circle cx="0" cy="0" r="102" fill="none" stroke="url(#goldLight)" strokeWidth="4" />
        <circle cx="0" cy="0" r="99" fill="none" stroke="#78350f" strokeWidth="1" />

        {/* Sky-Blue Circular Band */}
        <circle cx="0" cy="0" r="94" fill="url(#skyBlueRing)" stroke="url(#goldLight)" strokeWidth="3" />

        {/* Inner Gold Border */}
        <circle cx="0" cy="0" r="58" fill="#082f49" stroke="url(#goldLight)" strokeWidth="3" />

        {/* Indian Tri-Color Roundel Center */}
        <circle cx="0" cy="0" r="46" fill="#f97316" /> {/* Saffron */}
        <circle cx="0" cy="0" r="32" fill="#ffffff" /> {/* White */}
        <circle cx="0" cy="0" r="18" fill="#15803d" /> {/* Green */}

        {/* Devanagari Inscription: भारतीय वायु सेना */}
        {/* Curved text path */}
        <path id="textArcTop" d="M -76,15 A 78,78 0 1,1 76,15" fill="none" />
        <text fill="#ffffff" fontSize="13.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2.5">
          <textPath href="#textArcTop" startOffset="50%" textAnchor="middle">
            भारतीय वायु सेना
          </textPath>
        </text>

        {/* Inner Floral/Star Ornaments */}
        {[-70, 70].map((rot, i) => (
          <g key={i} transform={`rotate(${rot}) translate(0, -78)`}>
            <circle cx="0" cy="0" r="3" fill="url(#goldLight)" stroke="#451a03" strokeWidth="0.5" />
          </g>
        ))}
      </g>

      {/* ── 3. HIMALAYAN EAGLE (WINGS OUTSPREAD) ─────────────────── */}
      <g id="eagle" transform="translate(200, 220)">
        {/* Left Wing */}
        <path
          d="M -20,-10
             C -60,-65 -130,-75 -175,-35
             C -160,-15 -145,5 -125,25
             C -95,45 -60,40 -20,25
             C -50,15 -80,-5 -100,-25
             C -70,-35 -40,-25 -20,-10 Z"
          fill="url(#goldGrad)"
          stroke="#78350f"
          strokeWidth="1.5"
        />
        {/* Left Wing Feather Ridges */}
        {[-160, -145, -130, -115, -100, -85, -70, -55].map((x, i) => (
          <path
            key={`lw-${i}`}
            d={`M ${x},${-30 + i * 8} Q ${x + 20},${-20 + i * 7} ${x + 35},${-10 + i * 5}`}
            fill="none"
            stroke="url(#goldLight)"
            strokeWidth="1.3"
          />
        ))}

        {/* Right Wing */}
        <path
          d="M 20,-10
             C 60,-65 130,-75 175,-35
             C 160,-15 145,5 125,25
             C 95,45 60,40 20,25
             C 50,15 80,-5 100,-25
             C 70,-35 40,-25 20,-10 Z"
          fill="url(#goldGrad)"
          stroke="#78350f"
          strokeWidth="1.5"
        />
        {/* Right Wing Feather Ridges */}
        {[160, 145, 130, 115, 100, 85, 70, 55].map((x, i) => (
          <path
            key={`rw-${i}`}
            d={`M ${x},${-30 + i * 8} Q ${x - 20},${-20 + i * 7} ${x - 35},${-10 + i * 5}`}
            fill="none"
            stroke="url(#goldLight)"
            strokeWidth="1.3"
          />
        ))}

        {/* Eagle Body & Head */}
        <g id="eagle-head-body">
          {/* Eagle Tail Feathers */}
          <polygon points="0,55 -15,75 0,72 15,75" fill="url(#goldLight)" stroke="#78350f" strokeWidth="1" />

          {/* Eagle Torso */}
          <ellipse cx="0" cy="15" rx="18" ry="25" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="1.5" />
          {/* Feather marks on torso */}
          <path d="M-8,10 Q0,15 8,10 M-10,20 Q0,25 10,20 M-6,30 Q0,34 6,30" fill="none" stroke="#78350f" strokeWidth="1" />

          {/* Eagle Head (turned to heraldic right) */}
          <path d="M -8,-5 Q 0,-22 15,-18 Q 24,-14 26,-5 Q 22,0 12,5 Q 0,4 -8,-5 Z" fill="url(#goldLight)" stroke="#78350f" strokeWidth="1.5" />
          {/* Eagle Beak (sharp curved predator beak) */}
          <path d="M 22,-10 Q 32,-8 28,-1 Q 24,-2 20,-2 Z" fill="#facc15" stroke="#78350f" strokeWidth="1" />
          {/* Eagle Eye */}
          <circle cx="12" cy="-9" r="2.5" fill="#451a03" />
          <circle cx="12.5" cy="-9.5" r="0.8" fill="#ffffff" />
        </g>
      </g>

      {/* ── 4. GOLDEN SCROLL BANNER (BOTTOM) ─────────────────────── */}
      <g id="motto-banner" transform="translate(200, 395)">
        {/* Banner Ribbons Back Tails */}
        <path d="M -155,10 L -175,-5 L -165,22 L -145,18 Z" fill="#991b1b" stroke="#78350f" strokeWidth="1" />
        <path d="M 155,10 L 175,-5 L 165,22 L 145,18 Z" fill="#991b1b" stroke="#78350f" strokeWidth="1" />

        {/* Main Golden Ribbon Body */}
        <path
          d="M -150,0
             C -90,20 90,20 150,0
             C 140,28 120,38 90,32
             C 30,38 -30,38 -90,32
             C -120,38 -140,28 -150,0 Z"
          fill="url(#goldGrad)"
          stroke="#78350f"
          strokeWidth="1.5"
        />

        {/* Red Ribbon Edge Trim */}
        <path
          d="M -146,3 C -88,22 88,22 146,3"
          fill="none"
          stroke="#dc2626"
          strokeWidth="1.5"
        />

        {/* Motto in Devanagari: "नभः स्पृशं दीप्तम्" */}
        <text
          x="0"
          y="22"
          textAnchor="middle"
          fill="#451a03"
          fontSize="14.5"
          fontWeight="bold"
          fontFamily="sans-serif"
          letterSpacing="1.5"
        >
          नभः स्पृशं दीप्तम्
        </text>
      </g>
    </svg>
  );
}
