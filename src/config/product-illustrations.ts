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
  
  <!-- Central Graphic Glow -->
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
          fill="#18181b" opacity="0.85" />
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
        <!-- Athletic Sneaker Silhouette -->
        <path d="M325 255 C330 230 360 205 405 210 C440 215 465 240 480 255 L480 285 L320 285 Z" 
          fill="#0ea5e9" opacity="0.9" />
        <path d="M360 235 L400 225 L430 245" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" />
        <rect x="315" y="280" width="170" height="16" rx="5" fill="#f8fafc" stroke="#0f172a" stroke-width="2" />
      `;
    case "boot":
      return `
        <!-- Leather Chelsea Boot -->
        <path d="M350 180 H415 L420 235 C445 245 470 260 480 275 L480 295 L345 295 L345 220 Z" 
          fill="#78350f" opacity="0.95" />
        <rect x="340" y="290" width="145" height="15" rx="3" fill="#18181b" />
        <path d="M380 180 L375 220 L395 220 L390 180" fill="#451a03" />
      `;
    case "loafer":
      return `
        <!-- Classic Loafer Shoe -->
        <path d="M330 250 C350 230 430 230 475 255 L475 285 L325 285 Z" fill="#292524" />
        <rect x="320" y="280" width="160" height="14" rx="4" fill="#1c1917" />
        <rect x="385" y="240" width="30" height="6" rx="2" fill="#d97706" />
      `;
    case "lipstick":
      return `
        <!-- Luxury Lipstick -->
        <rect x="385" y="240" width="30" height="60" rx="3" fill="#18181b" />
        <rect x="380" y="235" width="40" height="8" rx="2" fill="#d4af37" />
        <path d="M390 235 L390 195 C390 190 410 180 415 190 L415 235 Z" fill="#e11d48" />
      `;
    case "serum":
      return `
        <!-- Dropper Serum Bottle -->
        <rect x="392" y="185" width="16" height="25" rx="3" fill="#64748b" />
        <path d="M370 220 H430 V295 H370 Z" fill="#38bdf8" opacity="0.85" rx="8" />
        <line x1="400" y1="230" x2="400" y2="280" stroke="#ffffff" stroke-width="2" />
      `;
    case "balm":
      return `
        <!-- Body Balm / Moisturizer Jar -->
        <rect x="355" y="230" width="90" height="20" rx="4" fill="#fb7185" opacity="0.9" />
        <rect x="360" y="250" width="80" height="35" rx="4" fill="#ffe4e6" />
        <circle cx="400" cy="268" r="12" fill="#ffffff" />
      `;
    case "cleanser":
      return `
        <!-- Cleanser Tube -->
        <path d="M365 200 H435 L425 280 H375 Z" fill="#0d9488" opacity="0.9" />
        <rect x="380" y="280" width="40" height="15" rx="2" fill="#134e4a" />
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
        <!-- Mechanical Keyboard -->
        <rect x="330" y="220" width="140" height="65" rx="8" fill="#1e293b" />
        <circle cx="355" cy="240" r="5" fill="#38bdf8" />
        <circle cx="375" cy="240" r="5" fill="#38bdf8" />
        <circle cx="395" cy="240" r="5" fill="#38bdf8" />
        <circle cx="415" cy="240" r="5" fill="#38bdf8" />
        <circle cx="435" cy="240" r="5" fill="#38bdf8" />
        <rect x="365" y="260" width="70" height="8" rx="3" fill="#cbd5e1" />
      `;
    case "watch":
      return `
        <!-- Minimalist Luxury Watch -->
        <rect x="388" y="170" width="24" height="150" rx="3" fill="#1c1917" />
        <circle cx="400" cy="245" r="45" fill="#f8fafc" stroke="#d4af37" stroke-width="4" />
        <line x1="400" y1="245" x2="400" y2="220" stroke="#18181b" stroke-width="2" />
        <line x1="400" y1="245" x2="420" y2="245" stroke="#18181b" stroke-width="2" />
      `;
    case "coffee":
      return `
        <!-- Artisan Coffee Bag -->
        <path d="M360 200 H440 L450 290 H350 Z" fill="#78350f" opacity="0.9" />
        <circle cx="400" cy="245" r="18" fill="#fbbf24" opacity="0.3" />
        <circle cx="400" cy="245" r="8" fill="#fbbf24" />
      `;
    case "honey":
      return `
        <!-- Mountain Honey Jar -->
        <rect x="375" y="200" width="50" height="15" rx="3" fill="#b45309" />
        <path d="M360 215 H440 L445 285 C445 295 435 300 400 300 C365 300 355 295 355 285 Z" fill="#f59e0b" />
        <rect x="380" y="240" width="40" height="25" rx="3" fill="#fef3c7" opacity="0.8" />
      `;
    case "oil":
      return `
        <!-- Extra Virgin Olive Oil -->
        <rect x="388" y="195" width="24" height="20" rx="2" fill="#3f6212" />
        <path d="M370 235 L388 215 H412 L430 235 V295 H370 Z" fill="#65a30d" opacity="0.9" />
        <circle cx="400" cy="265" r="10" fill="#a3e635" opacity="0.6" />
      `;
    default:
      return `
        <circle cx="400" cy="250" r="30" fill="#18181b" opacity="0.2" />
      `;
  }
}
