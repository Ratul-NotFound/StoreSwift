/**
 * Self-contained, zero-dependency, high-resolution SVG product illustrations.
 * Guaranteed 0ms load time, offline-ready, no external CDN latency or rate-limiting.
 */

export function createProductSvgDataUri(
  title: string,
  category: string,
  themeColor: string,
  accentColor: string,
  iconType: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${themeColor}" />
      <stop offset="100%" stop-color="${accentColor}" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-opacity="0.08" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  
  <!-- Subtle Grid Pattern -->
  <g opacity="0.06" stroke="#000" stroke-width="1">
    <path d="M0 100 H800 M0 200 H800 M0 300 H800 M0 400 H800 M0 500 H800" />
    <path d="M100 0 V600 M200 0 V600 M300 0 V600 M400 0 V600 M500 0 V600 M600 0 V600 M700 0 V600" />
  </g>

  <!-- Central Showcase Card -->
  <rect x="220" y="100" width="360" height="380" rx="28" fill="#ffffff" filter="url(#shadow)" />
  
  <!-- Central Graphic -->
  <circle cx="400" cy="250" r="80" fill="${accentColor}" opacity="0.15" />
  
  ${getCentralGraphic(iconType)}

  <!-- Product Labels inside graphic -->
  <text x="400" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#18181b" text-anchor="middle" letter-spacing="-0.5">
    ${escapeXml(title)}
  </text>
  <text x="400" y="415" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#71717a" text-anchor="middle" letter-spacing="1" text-transform="uppercase">
    ${escapeXml(category)}
  </text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function getCentralGraphic(type: string): string {
  switch (type) {
    case "tshirt":
      return `
        <!-- T-Shirt Silhouette -->
        <path d="M350 190 L320 230 L345 250 L360 235 V310 H440 V235 L455 250 L480 230 L450 190 C430 205 370 205 350 190 Z" 
          fill="#18181b" opacity="0.85" rx="4" />
      `;
    case "jeans":
      return `
        <!-- Denim Jeans Silhouette -->
        <path d="M360 190 H440 L450 310 L415 310 L400 240 L385 310 L350 310 Z" 
          fill="#1e3a8a" opacity="0.85" />
        <line x1="400" y1="190" x2="400" y2="240" stroke="#3b82f6" stroke-width="2" />
      `;
    case "sneaker":
      return `
        <!-- Minimal Sneaker Silhouette -->
        <path d="M330 260 C330 260 360 210 400 210 C440 210 460 250 475 255 L475 285 L330 285 Z" 
          fill="#d97706" opacity="0.85" />
        <rect x="325" y="280" width="155" height="15" rx="4" fill="#ffffff" stroke="#18181b" stroke-width="2" />
      `;
    case "headphones":
      return `
        <!-- Modern Headphones -->
        <path d="M340 260 A60 60 0 0 1 460 260" fill="none" stroke="#18181b" stroke-width="8" stroke-linecap="round" />
        <rect x="330" y="240" width="22" height="45" rx="8" fill="#18181b" />
        <rect x="448" y="240" width="22" height="45" rx="8" fill="#18181b" />
      `;
    case "hub":
      return `
        <!-- USB Hub -->
        <rect x="350" y="220" width="100" height="60" rx="10" fill="#475569" />
        <rect x="365" y="240" width="15" height="6" rx="2" fill="#94a3b8" />
        <rect x="392" y="240" width="15" height="6" rx="2" fill="#94a3b8" />
        <rect x="420" y="240" width="15" height="6" rx="2" fill="#94a3b8" />
      `;
    case "keyboard":
      return `
        <!-- Keyboard -->
        <rect x="330" y="220" width="140" height="65" rx="8" fill="#1e293b" />
        <circle cx="355" cy="240" r="5" fill="#38bdf8" />
        <circle cx="375" cy="240" r="5" fill="#38bdf8" />
        <circle cx="395" cy="240" r="5" fill="#38bdf8" />
        <circle cx="415" cy="240" r="5" fill="#38bdf8" />
        <circle cx="435" cy="240" r="5" fill="#38bdf8" />
        <rect x="365" y="260" width="70" height="8" rx="3" fill="#cbd5e1" />
      `;
    case "coffee":
      return `
        <!-- Coffee Bag -->
        <path d="M360 200 H440 L450 290 H350 Z" fill="#78350f" opacity="0.9" />
        <circle cx="400" cy="245" r="18" fill="#fbbf24" opacity="0.3" />
        <text x="400" y="250" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">☕</text>
      `;
    case "honey":
      return `
        <!-- Honey Jar -->
        <rect x="375" y="200" width="50" height="15" rx="3" fill="#b45309" />
        <path d="M360 215 H440 L445 285 C445 295 435 300 400 300 C365 300 355 295 355 285 Z" fill="#f59e0b" />
        <text x="400" y="265" font-family="sans-serif" font-size="18" text-anchor="middle">🍯</text>
      `;
    case "oil":
      return `
        <!-- Olive Oil Bottle -->
        <rect x="388" y="195" width="24" height="20" rx="2" fill="#3f6212" />
        <path d="M370 235 L388 215 H412 L430 235 V295 H370 Z" fill="#65a30d" opacity="0.9" />
        <circle cx="400" cy="265" r="10" fill="#a3e635" opacity="0.6" />
      `;
    case "serum":
      return `
        <!-- Serum Bottle -->
        <rect x="390" y="190" width="20" height="25" rx="4" fill="#0284c7" />
        <path d="M370 225 H430 V295 H370 Z" fill="#38bdf8" opacity="0.85" rx="8" />
        <line x1="400" y1="235" x2="400" y2="280" stroke="#ffffff" stroke-width="2" />
      `;
    case "balm":
      return `
        <!-- Body Balm Jar -->
        <rect x="355" y="230" width="90" height="20" rx="4" fill="#e11d48" opacity="0.9" />
        <rect x="360" y="250" width="80" height="35" rx="4" fill="#fda4af" />
        <circle cx="400" cy="268" r="12" fill="#ffffff" />
      `;
    case "cleanser":
      return `
        <!-- Cleanser Tube -->
        <path d="M365 200 H435 L425 280 H375 Z" fill="#0d9488" opacity="0.9" />
        <rect x="380" y="280" width="40" height="15" rx="2" fill="#134e4a" />
      `;
    default:
      return `
        <circle cx="400" cy="250" r="30" fill="#18181b" opacity="0.2" />
      `;
  }
}

