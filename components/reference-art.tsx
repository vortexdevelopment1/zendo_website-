export function PlanetNetworkArt() {
  return <svg className="zendo-reference-art zendo-planet-art" viewBox="0 0 640 460" role="img" aria-label="Zendo planet network artwork">
    <defs>
      <radialGradient id="planet-glow" cx="52%" cy="46%"><stop offset="0" stopColor="#2d8dff" stopOpacity=".9"/><stop offset=".58" stopColor="#3034a6" stopOpacity=".5"/><stop offset="1" stopColor="#050817" stopOpacity="0"/></radialGradient>
      <linearGradient id="planet-sphere" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#5be5ff"/><stop offset=".45" stopColor="#3157d7"/><stop offset="1" stopColor="#5b1f92"/></linearGradient>
      <filter id="soft-glow"><feGaussianBlur stdDeviation="10"/></filter>
      <filter id="small-glow"><feGaussianBlur stdDeviation="2"/></filter>
    </defs>
    <ellipse cx="370" cy="236" rx="235" ry="185" fill="url(#planet-glow)" filter="url(#soft-glow)"/>
    <circle cx="365" cy="230" r="150" fill="url(#planet-sphere)" opacity=".95"/>
    <ellipse cx="365" cy="230" rx="178" ry="63" fill="none" stroke="#70e8ff" strokeOpacity=".55" strokeWidth="3" transform="rotate(-20 365 230)"/>
    <ellipse cx="365" cy="230" rx="166" ry="50" fill="none" stroke="#9b5cff" strokeOpacity=".65" strokeWidth="2" transform="rotate(35 365 230)"/>
    <path d="M225 276C305 195 402 179 518 203M242 170c78 62 157 88 282 77M259 322c85-65 168-94 251-111" fill="none" stroke="#b6f5ff" strokeOpacity=".42" strokeWidth="2"/>
    <path d="M318 258l30-70 22 35 45-17-34 68-22-31z" fill="#d6ff19" stroke="#efff9d" strokeWidth="3"/>
    <g fill="#a5f3ff"><circle cx="215" cy="126" r="4"/><circle cx="530" cy="132" r="3"/><circle cx="558" cy="288" r="5"/><circle cx="198" cy="333" r="3"/><circle cx="468" cy="74" r="3"/></g>
    <g stroke="#7edfff" strokeOpacity=".45"><path d="M215 126l75 26M530 132l-52 61M558 288l-75-42M198 333l61-42"/></g>
    <text x="365" y="414" textAnchor="middle" fill="#c8ff00" fontFamily="Arial, sans-serif" fontSize="13" letterSpacing="4">ZENDO L-1 · NETWORK LAYER</text>
  </svg>;
}

export function LaunchpadArt() {
  return (
    <svg className="zendo-reference-art zendo-launchpad-art" viewBox="0 0 200 200" role="img" aria-label="Launchpad rocket artwork">
      <defs>
        <radialGradient id="rkt-glow" cx="50%" cy="60%">
          <stop offset="0" stopColor="#39ff6a" stopOpacity=".55"/>
          <stop offset="1" stopColor="#39ff6a" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="rkt-body" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a8ff5a"/>
          <stop offset="1" stopColor="#22e855"/>
        </linearGradient>
        <filter id="rkt-blur"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      {/* glow backdrop */}
      <ellipse cx="100" cy="130" rx="60" ry="40" fill="url(#rkt-glow)" filter="url(#rkt-blur)"/>
      {/* rocket body */}
      <path d="M100 28 C78 50 68 80 68 112 L100 128 L132 112 C132 80 122 50 100 28Z" fill="url(#rkt-body)"/>
      {/* nose tip */}
      <path d="M100 28 L90 56 L110 56Z" fill="#d6ffaa"/>
      {/* window */}
      <circle cx="100" cy="82" r="10" fill="#0d1f12" stroke="#a8ff5a" strokeWidth="3"/>
      <circle cx="100" cy="82" r="5" fill="#39ff6a" opacity=".7"/>
      {/* fins */}
      <path d="M68 112 L50 138 L68 130Z" fill="#5cff8a"/>
      <path d="M132 112 L150 138 L132 130Z" fill="#5cff8a"/>
      {/* flames */}
      <path d="M85 128 C82 145 86 162 100 172 C114 162 118 145 115 128Z" fill="#ffb820" opacity=".9"/>
      <path d="M90 128 C89 148 94 162 100 168 C106 162 111 148 110 128Z" fill="#fff176" opacity=".85"/>
    </svg>
  );
}

export function StudioArt() {
  return (
    <svg className="zendo-reference-art zendo-studio-art" viewBox="0 0 200 200" role="img" aria-label="Developer studio code artwork">
      <defs>
        <radialGradient id="std-glow" cx="50%" cy="50%">
          <stop offset="0" stopColor="#c084fc" stopOpacity=".6"/>
          <stop offset="1" stopColor="#c084fc" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="std-body" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e879f9"/>
          <stop offset="1" stopColor="#7c3aed"/>
        </linearGradient>
        <filter id="std-blur"><feGaussianBlur stdDeviation="10"/></filter>
      </defs>
      {/* glow */}
      <ellipse cx="100" cy="100" rx="65" ry="65" fill="url(#std-glow)" filter="url(#std-blur)"/>
      {/* diamond shape */}
      <path d="M100 30 L150 80 L100 170 L50 80 Z" fill="url(#std-body)" opacity=".92"/>
      {/* inner highlight */}
      <path d="M100 30 L150 80 L100 100 L50 80 Z" fill="#e9d5ff" opacity=".25"/>
      {/* code brackets inside */}
      <text x="100" y="115" textAnchor="middle" fontFamily="monospace" fontSize="32" fontWeight="900" fill="#fff" opacity=".9">&lt;/&gt;</text>
    </svg>
  );
}

export function ExplorerCubeArt() {
  return (
    <svg className="zendo-reference-art zendo-explorer-art" viewBox="0 0 200 200" role="img" aria-label="Blockchain explorer cube artwork">
      <defs>
        <radialGradient id="cub-glow" cx="50%" cy="60%">
          <stop offset="0" stopColor="#38bdf8" stopOpacity=".6"/>
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="cub-top" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#7dd3fc"/>
          <stop offset="1" stopColor="#38bdf8"/>
        </linearGradient>
        <linearGradient id="cub-left" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#0ea5e9"/>
          <stop offset="1" stopColor="#0369a1"/>
        </linearGradient>
        <linearGradient id="cub-right" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#38bdf8"/>
          <stop offset="1" stopColor="#0284c7"/>
        </linearGradient>
        <filter id="cub-blur"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>
      {/* glow */}
      <ellipse cx="100" cy="140" rx="58" ry="30" fill="url(#cub-glow)" filter="url(#cub-blur)"/>
      {/* Back cube (bottom) */}
      <path d="M100 90 L136 68 L172 90 L136 112Z" fill="url(#cub-top)" opacity=".55"/>
      <path d="M136 112 L172 90 L172 124 L136 146Z" fill="url(#cub-right)" opacity=".55"/>
      <path d="M100 90 L136 112 L136 146 L100 124Z" fill="url(#cub-left)" opacity=".55"/>
      {/* Middle cube */}
      <path d="M72 78 L108 56 L144 78 L108 100Z" fill="url(#cub-top)" opacity=".75"/>
      <path d="M108 100 L144 78 L144 114 L108 136Z" fill="url(#cub-right)" opacity=".75"/>
      <path d="M72 78 L108 100 L108 136 L72 114Z" fill="url(#cub-left)" opacity=".75"/>
      {/* Front cube (top) */}
      <path d="M46 64 L82 42 L118 64 L82 86Z" fill="url(#cub-top)"/>
      <path d="M82 86 L118 64 L118 100 L82 122Z" fill="url(#cub-right)"/>
      <path d="M46 64 L82 86 L82 122 L46 100Z" fill="url(#cub-left)"/>
      {/* edge highlights */}
      <path d="M46 64 L82 42 L118 64" fill="none" stroke="#bae6fd" strokeWidth="1.5" opacity=".8"/>
      <path d="M82 42 L82 86" fill="none" stroke="#bae6fd" strokeWidth="1.5" opacity=".8"/>
    </svg>
  );
}

export function ZCoinArt() {
  return (
    <svg className="zendo-reference-art zendo-zcoin-art" viewBox="0 0 200 200" role="img" aria-label="ZCoin stacked coins artwork">
      <defs>
        <radialGradient id="gc-glow" cx="50%" cy="60%">
          <stop offset="0" stopColor="#fbbf24" stopOpacity=".55"/>
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="gc-top" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fde68a"/>
          <stop offset="1" stopColor="#f59e0b"/>
        </linearGradient>
        <linearGradient id="gc-side" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#d97706"/>
          <stop offset="1" stopColor="#92400e"/>
        </linearGradient>
        <filter id="gc-blur"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>
      {/* glow */}
      <ellipse cx="100" cy="148" rx="55" ry="28" fill="url(#gc-glow)" filter="url(#gc-blur)"/>
      {/* Bottom coin */}
      <ellipse cx="100" cy="148" rx="52" ry="18" fill="url(#gc-side)"/>
      <ellipse cx="100" cy="138" rx="52" ry="18" fill="url(#gc-top)"/>
      <ellipse cx="100" cy="138" rx="40" ry="12" fill="#fef3c7" opacity=".35"/>
      {/* Middle coin */}
      <ellipse cx="100" cy="122" rx="52" ry="18" fill="url(#gc-side)"/>
      <ellipse cx="100" cy="112" rx="52" ry="18" fill="url(#gc-top)"/>
      <ellipse cx="100" cy="112" rx="40" ry="12" fill="#fef3c7" opacity=".35"/>
      {/* Top coin */}
      <ellipse cx="100" cy="96" rx="52" ry="18" fill="url(#gc-side)"/>
      <ellipse cx="100" cy="86" rx="52" ry="18" fill="url(#gc-top)"/>
      <ellipse cx="100" cy="86" rx="40" ry="12" fill="#fef3c7" opacity=".4"/>
      {/* Z letter on top coin */}
      <text x="100" y="92" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="20" fontWeight="900" fill="#92400e" opacity=".9">Z</text>
    </svg>
  );
}

export function BridgeArt() { return <svg className="zendo-reference-art zendo-bridge-art" viewBox="0 0 380 160" role="img" aria-label="Cross-chain bridge artwork"><defs><linearGradient id="bridge" x1="0" x2="1"><stop stopColor="#5ce8ff"/><stop offset="1" stopColor="#7659ff"/></linearGradient></defs><rect x="30" y="54" width="88" height="54" rx="14" fill="#0d1c35" stroke="#42cfff" strokeWidth="3"/><rect x="262" y="54" width="88" height="54" rx="14" fill="#151238" stroke="#895dff" strokeWidth="3"/><path d="M118 81h144" stroke="url(#bridge)" strokeWidth="8" strokeDasharray="13 9"/><path d="M221 62l25 19-25 19" fill="none" stroke="#c8ff00" strokeWidth="6"/><circle cx="74" cy="81" r="13" fill="#c8ff00"/><circle cx="306" cy="81" r="13" fill="#895dff"/><text x="74" y="86" textAnchor="middle" fontSize="14" fontWeight="700" fill="#07111d">Z</text><text x="306" y="86" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">P</text></svg>; }

export function CompanyArt() { return <svg className="zendo-reference-art zendo-company-art" viewBox="0 0 420 240" role="img" aria-label="Zendo company artwork"><defs><linearGradient id="city" x1="0" x2="1"><stop stopColor="#162a51"/><stop offset="1" stopColor="#492a85"/></linearGradient></defs><path d="M40 205V125l50-22v102M108 205V76l54-22v151M177 205V112l62-36v129M255 205V52l55-22v175M323 205v-96l57-30v126" fill="url(#city)" stroke="#5ae5ff" strokeOpacity=".7" strokeWidth="2"/><g fill="#c8ff00"><circle cx="88" cy="145" r="4"/><circle cx="155" cy="104" r="4"/><circle cx="285" cy="95" r="4"/><circle cx="353" cy="132" r="4"/></g><path d="M30 205h360" stroke="#c8ff00" strokeWidth="4"/></svg>; }

export function LegalArt() { return <svg className="zendo-reference-art zendo-legal-art" viewBox="0 0 240 220" role="img" aria-label="Legal document artwork"><path d="M44 22h112l40 40v136H44z" fill="#101b31" stroke="#58dfff" strokeWidth="4"/><path d="M156 22v42h40" fill="none" stroke="#8b67ff" strokeWidth="4"/><path d="M73 99h92M73 121h92M73 143h70" stroke="#c8ff00" strokeWidth="7" strokeLinecap="round"/><circle cx="88" cy="66" r="16" fill="#c8ff00"/><path d="M80 66l6 7 12-14" fill="none" stroke="#0a0a0a" strokeWidth="4"/></svg>; }
