const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

async function generateInstagramAssets() {
  console.log('🚀 Gerando artes promocionais para o Instagram...');

  const rootDir = path.resolve(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');

  // Load Base64 of the exact bull icon and sciencebit logo
  const iconBase64 = fs.readFileSync(path.join(publicDir, 'playstore-icon-512.png')).toString('base64');
  const scienceBitLogoBase64 = fs.readFileSync(path.join(publicDir, 'sciencebit-logo-white.png')).toString('base64');

  // =========================================================================
  // 1. INSTAGRAM FEED POST (1080 x 1080 px) - Formato Quadrado para o Feed
  // =========================================================================
  const feedSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <!-- Background Luxury Dark Metallic Gradient -->
    <linearGradient id="bgFeed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#040711"/>
      <stop offset="35%" stop-color="#0a1224"/>
      <stop offset="70%" stop-color="#080e1a"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>

    <!-- Cyan to Emerald Gradient -->
    <linearGradient id="cyanEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>

    <!-- Gold Gradient -->
    <linearGradient id="goldFeed" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>

    <!-- Card Background -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#090d16" stop-opacity="0.98"/>
    </linearGradient>

    <!-- Radial Glows -->
    <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="60" result="blur"/>
    </filter>
    <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="50" result="blur"/>
    </filter>
    <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0284c7" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- 1. Background -->
  <rect width="1080" height="1080" fill="url(#bgFeed)"/>

  <!-- Ambient Light Orbs -->
  <circle cx="200" cy="220" r="260" fill="#2563eb" opacity="0.22" filter="url(#glowBlue)"/>
  <circle cx="880" cy="300" r="280" fill="#10b981" opacity="0.18" filter="url(#glowGreen)"/>
  <circle cx="540" cy="850" r="300" fill="#3b82f6" opacity="0.15" filter="url(#glowBlue)"/>

  <!-- Subtle Financial Grid Lines -->
  <g opacity="0.06" stroke="#94a3b8" stroke-width="1.5">
    <line x1="0" y1="180" x2="1080" y2="180"/>
    <line x1="0" y1="360" x2="1080" y2="360"/>
    <line x1="0" y1="540" x2="1080" y2="540"/>
    <line x1="0" y1="720" x2="1080" y2="720"/>
    <line x1="0" y1="900" x2="1080" y2="900"/>
    <line x1="180" y1="0" x2="180" y2="1080"/>
    <line x1="360" y1="0" x2="360" y2="1080"/>
    <line x1="540" y1="0" x2="540" y2="1080"/>
    <line x1="720" y1="0" x2="720" y2="1080"/>
    <line x1="900" y1="0" x2="900" y2="1080"/>
  </g>

  <!-- Top Decorative Wave -->
  <path d="M -50 480 Q 250 560 540 420 T 1130 320" fill="none" stroke="#38bdf8" stroke-width="2.5" opacity="0.25" stroke-dasharray="10,6"/>

  <!-- ================= HEADER SECTION ================= -->
  <g transform="translate(60, 50)">
    <!-- ScienceBit Logo on the Left -->
    <g transform="translate(0, 0)">
      <image href="data:image/png;base64,${scienceBitLogoBase64}" x="0" y="0" width="180" height="42" preserveAspectRatio="xMidYMid meet"/>
    </g>

    <!-- Category Pill Badge on the Right -->
    <g transform="translate(630, 0)">
      <rect width="330" height="42" rx="21" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
      <circle cx="22" cy="21" r="6" fill="#38bdf8"/>
      <text x="38" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#e2e8f0" letter-spacing="1.5">NYSE • NASDAQ • S&amp;P 500</text>
    </g>
  </g>

  <!-- ================= HERO PRESENTATION ================= -->
  <!-- App Icon Display with Halo -->
  <g transform="translate(70, 130)">
    <!-- Glow Backdrop -->
    <circle cx="95" cy="95" r="105" fill="#38bdf8" opacity="0.25" filter="url(#glowBlue)"/>
    
    <!-- Exact User Bull App Icon -->
    <g filter="url(#iconShadow)">
      <image href="data:image/png;base64,${iconBase64}" x="0" y="0" width="190" height="190" />
    </g>

    <!-- App Title & Subtitle Next to Icon -->
    <g transform="translate(225, 20)">
      <g transform="translate(0, 0)">
        <rect width="210" height="26" rx="13" fill="#2563eb" fill-opacity="0.25" stroke="#3b82f6" stroke-width="1"/>
        <text x="105" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" fill="#60a5fa" text-anchor="middle" letter-spacing="1.5">NOVO APLICATIVO OFICIAL</text>
      </g>

      <text x="0" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="-1">
        WALL STREET
      </text>
      <text x="0" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="url(#cyanEmerald)" letter-spacing="-1">
        SCANNER PRO
      </text>
      <text x="0" y="148" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#94a3b8">
        Swing Trade de Alta Performance em Ações Americanas
      </text>
    </g>
  </g>

  <!-- Golden Catchphrase Banner -->
  <g transform="translate(60, 360)">
    <rect width="960" height="74" rx="18" fill="#1c1608" stroke="#f59e0b" stroke-width="2"/>
    <g transform="translate(25, 20)">
      <circle cx="18" cy="17" r="16" fill="#78350f"/>
      <text x="18" y="24" font-family="sans-serif" font-size="18" text-anchor="middle">⚠️</text>
      <text x="48" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="900" fill="#fbbf24">
        REGRA DE OURO: <tspan fill="#ffffff" font-weight="700">Espere o Candlestick de Confirmação!</tspan>
      </text>
      <text x="48" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#cbd5e1">
        Nunca compre uma faca caindo sem reação: detecte Martelos, Pinbars e fechamentos no suporte.
      </text>
    </g>
  </g>

  <!-- ================= 4 CORE FEATURES GRID ================= -->
  <g transform="translate(60, 460)">
    <!-- Feature 1: Scanner de Sobrevenda -->
    <g transform="translate(0, 0)">
      <rect width="465" height="140" rx="18" fill="url(#cardBg)" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="45" cy="45" r="22" fill="#2563eb" fill-opacity="0.25"/>
      <text x="45" y="52" font-family="sans-serif" font-size="20" text-anchor="middle">🎯</text>
      <text x="80" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#ffffff">
        Rastreamento de Sobrevenda
      </text>
      <text x="80" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94a3b8">
        Identifique o fundo exato de exaustão em centenas de ações e ETFs dos EUA em tempo real.
      </text>
      <rect x="80" y="94" width="170" height="24" rx="6" fill="#10b981" fill-opacity="0.15"/>
      <text x="165" y="110" font-family="sans-serif" font-size="11.5" font-weight="800" fill="#34d399" text-anchor="middle">RSI &lt; 30 • Estocástico</text>
    </g>

    <!-- Feature 2: Suportes & Fibonacci -->
    <g transform="translate(495, 0)">
      <rect width="465" height="140" rx="18" fill="url(#cardBg)" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="45" cy="45" r="22" fill="#f59e0b" fill-opacity="0.25"/>
      <text x="45" y="52" font-family="sans-serif" font-size="20" text-anchor="middle">📐</text>
      <text x="80" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#ffffff">
        Fibonacci 61.8% &amp; Médias
      </text>
      <text x="80" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94a3b8">
        Cálculo automatizado das retrações de ouro de Fibonacci e confluência com EMA 20, 50 e 200.
      </text>
      <rect x="80" y="94" width="165" height="24" rx="6" fill="#f59e0b" fill-opacity="0.15"/>
      <text x="162" y="110" font-family="sans-serif" font-size="11.5" font-weight="800" fill="#fbbf24" text-anchor="middle">Zona de Ouro Fibo 61.8%</text>
    </g>

    <!-- Feature 3: Inteligência Artificial & ML -->
    <g transform="translate(0, 160)">
      <rect width="465" height="140" rx="18" fill="url(#cardBg)" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="45" cy="45" r="22" fill="#a855f7" fill-opacity="0.25"/>
      <text x="45" y="52" font-family="sans-serif" font-size="20" text-anchor="middle">🤖</text>
      <text x="80" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#ffffff">
        IA Preditiva &amp; Machine Learning
      </text>
      <text x="80" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94a3b8">
        Modelos matemáticos ensemble calculam a probabilidade de ganho e alvos de retorno a 5 dias.
      </text>
      <rect x="80" y="94" width="175" height="24" rx="6" fill="#a855f7" fill-opacity="0.15"/>
      <text x="167" y="110" font-family="sans-serif" font-size="11.5" font-weight="800" fill="#c084fc" text-anchor="middle">Algoritmo Quant Score</text>
    </g>

    <!-- Feature 4: Triple Screen & Minervini -->
    <g transform="translate(495, 160)">
      <rect width="465" height="140" rx="18" fill="url(#cardBg)" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="45" cy="45" r="22" fill="#06b6d4" fill-opacity="0.25"/>
      <text x="45" y="52" font-family="sans-serif" font-size="20" text-anchor="middle">🧭</text>
      <text x="80" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#ffffff">
        Triple Screen (Alexander Elder)
      </text>
      <text x="80" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94a3b8">
        Filtro multi-timeframe semanal e diário + Template de Tendência em 8 estágios de Minervini.
      </text>
      <rect x="80" y="94" width="180" height="24" rx="6" fill="#06b6d4" fill-opacity="0.15"/>
      <text x="170" y="110" font-family="sans-serif" font-size="11.5" font-weight="800" fill="#38bdf8" text-anchor="middle">Semanal + Diário Alinhados</text>
    </g>
  </g>

  <!-- ================= CALL TO ACTION FOOTER ================= -->
  <g transform="translate(60, 800)">
    <!-- Container Card -->
    <rect width="960" height="220" rx="24" fill="#0c1322" stroke="#2563eb" stroke-width="2"/>

    <!-- Left Text & Download Prompt -->
    <g transform="translate(40, 40)">
      <g transform="translate(0, 0)">
        <rect width="180" height="28" rx="8" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="1"/>
        <text x="90" y="19" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#34d399" text-anchor="middle">100% GRATUITO</text>
      </g>
      <text x="0" y="64" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#ffffff">
        Instale Agora na Google Play Store
      </text>
      <text x="0" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" fill="#94a3b8">
        Toque no link da bio ou busque por <tspan fill="#38bdf8" font-weight="800">"Wall Street Scanner"</tspan> no Android
      </text>
      <text x="0" y="125" font-family="monospace" font-size="13.5" font-weight="700" fill="#60a5fa">
        play.google.com/store/apps/details?id=com.sciencebit.wallstreetscanner
      </text>
    </g>

    <!-- Right Google Play Official Badge Simulation -->
    <g transform="translate(680, 50)">
      <rect width="240" height="72" rx="14" fill="#000000" stroke="#475569" stroke-width="1.5"/>
      <!-- Play Icon Triangle -->
      <path d="M 28 20 L 46 36 L 28 52 Z" fill="#38bdf8"/>
      <path d="M 28 20 L 40 32 L 28 36 Z" fill="#10b981"/>
      <path d="M 28 36 L 40 40 L 28 52 Z" fill="#ef4444"/>
      <path d="M 40 32 L 46 36 L 40 40 Z" fill="#fbbf24"/>

      <!-- Text -->
      <text x="60" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" letter-spacing="1">DISPONÍVEL NO</text>
      <text x="60" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#ffffff">Google Play</text>
    </g>
  </g>
</svg>
  `.trim();

  // =========================================================================
  // 2. INSTAGRAM STORY / REELS (1080 x 1920 px) - Formato Vertical
  // =========================================================================
  const storySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="bgStory" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#030611"/>
      <stop offset="35%" stop-color="#0a1329"/>
      <stop offset="70%" stop-color="#060c18"/>
      <stop offset="100%" stop-color="#020409"/>
    </linearGradient>

    <linearGradient id="cyanStory" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>

    <filter id="glowStory" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="70" result="blur"/>
    </filter>
  </defs>

  <rect width="1080" height="1920" fill="url(#bgStory)"/>
  <circle cx="200" cy="300" r="350" fill="#2563eb" opacity="0.2" filter="url(#glowStory)"/>
  <circle cx="850" cy="650" r="350" fill="#10b981" opacity="0.18" filter="url(#glowStory)"/>
  <circle cx="500" cy="1400" r="400" fill="#3b82f6" opacity="0.15" filter="url(#glowStory)"/>

  <!-- Top Brand Section -->
  <g transform="translate(0, 100)">
    <image href="data:image/png;base64,${scienceBitLogoBase64}" x="415" y="0" width="250" height="55" preserveAspectRatio="xMidYMid meet"/>
    <text x="540" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#60a5fa" text-anchor="middle" letter-spacing="3">APRESENTA O NOVO APP OFICIAL</text>
  </g>

  <!-- Big Central Icon & Title -->
  <g transform="translate(0, 240)">
    <!-- App Icon (Center) -->
    <g transform="translate(420, 0)">
      <circle cx="120" cy="120" r="140" fill="#38bdf8" opacity="0.25" filter="url(#glowStory)"/>
      <image href="data:image/png;base64,${iconBase64}" x="0" y="0" width="240" height="240" />
    </g>

    <text x="540" y="320" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="-1">
      WALL STREET SCANNER
    </text>
    <text x="540" y="375" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="url(#cyanStory)" text-anchor="middle">
      SWING TRADE PRO
    </text>
    <text x="540" y="420" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="#94a3b8" text-anchor="middle">
      S&amp;P 500 • NASDAQ • NYSE • ETFs Americanos
    </text>
  </g>

  <!-- Golden Rule Banner -->
  <g transform="translate(60, 720)">
    <rect width="960" height="110" rx="22" fill="#1c1608" stroke="#f59e0b" stroke-width="2.5"/>
    <g transform="translate(30, 25)">
      <circle cx="28" cy="28" r="24" fill="#78350f"/>
      <text x="28" y="38" font-family="sans-serif" font-size="28" text-anchor="middle">⚠️</text>
      <text x="75" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="#fbbf24">
        Espere o Candlestick de Confirmação!
      </text>
      <text x="75" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="500" fill="#e2e8f0">
        Nunca compre uma faca caindo sem reação: detecte Martelos, Pinbars e Fibo 61.8%.
      </text>
    </g>
  </g>

  <!-- Key Features List -->
  <g transform="translate(60, 870)">
    <!-- Feature 1 -->
    <g transform="translate(0, 0)">
      <rect width="960" height="135" rx="20" fill="#0c1322" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="65" cy="67" r="32" fill="#2563eb" fill-opacity="0.25"/>
      <text x="65" y="78" font-family="sans-serif" font-size="30" text-anchor="middle">🎯</text>
      <text x="120" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#ffffff">Rastreamento de Sobrevenda Extrema</text>
      <text x="120" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="500" fill="#94a3b8">Varredura contínua de ações com RSI &lt; 30 e Estocástico em exaustão.</text>
    </g>

    <!-- Feature 2 -->
    <g transform="translate(0, 160)">
      <rect width="960" height="135" rx="20" fill="#0c1322" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="65" cy="67" r="32" fill="#f59e0b" fill-opacity="0.25"/>
      <text x="65" y="78" font-family="sans-serif" font-size="30" text-anchor="middle">📐</text>
      <text x="120" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#ffffff">Retração de Fibonacci 61.8% &amp; Médias</text>
      <text x="120" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="500" fill="#94a3b8">Zona de ouro de reversão e suportes das médias EMA 20, 50 e 200.</text>
    </g>

    <!-- Feature 3 -->
    <g transform="translate(0, 320)">
      <rect width="960" height="135" rx="20" fill="#0c1322" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="65" cy="67" r="32" fill="#a855f7" fill-opacity="0.25"/>
      <text x="65" y="78" font-family="sans-serif" font-size="30" text-anchor="middle">🤖</text>
      <text x="120" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#ffffff">Modelos Preditivos de IA &amp; Quant Score</text>
      <text x="120" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="500" fill="#94a3b8">Probabilidades de ganho e alvos de retorno calculados por Machine Learning.</text>
    </g>

    <!-- Feature 4 -->
    <g transform="translate(0, 480)">
      <rect width="960" height="135" rx="20" fill="#0c1322" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="65" cy="67" r="32" fill="#06b6d4" fill-opacity="0.25"/>
      <text x="65" y="78" font-family="sans-serif" font-size="30" text-anchor="middle">🧭</text>
      <text x="120" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#ffffff">Triple Screen &amp; Mark Minervini</text>
      <text x="120" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="500" fill="#94a3b8">Alinhamento semanal + diário para entrar a favor da tendência primária.</text>
    </g>
  </g>

  <!-- Big Call to Action Button in Bottom -->
  <g transform="translate(60, 1530)">
    <rect width="960" height="240" rx="28" fill="#080e1d" stroke="#2563eb" stroke-width="2.5"/>

    <g transform="translate(480, 50)" text-anchor="middle">
      <rect x="-110" y="-15" width="220" height="34" rx="10" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="1.2"/>
      <text x="0" y="9" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#34d399">100% GRATUITO</text>

      <text x="0" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#ffffff">
        BAIXE AGORA NO GOOGLE PLAY
      </text>
      <text x="0" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="#38bdf8">
        Link direto disponível na BIO do perfil!
      </text>
      <text x="0" y="140" font-family="monospace" font-size="15" font-weight="700" fill="#94a3b8">
        Pesquise por: "Wall Street Scanner" no Android
      </text>
    </g>
  </g>
</svg>
  `.trim();

  // Save SVG and render high-res PNG using Resvg
  const resvgFeed = new Resvg(feedSvg, { fitTo: { mode: 'width', value: 1080 } });
  const pngFeed = resvgFeed.render().asPng();
  fs.writeFileSync(path.join(publicDir, 'instagram-post-feed.png'), pngFeed);
  console.log(`✅ Gerado instagram-post-feed.png (${pngFeed.length} bytes)`);

  const resvgStory = new Resvg(storySvg, { fitTo: { mode: 'width', value: 1080 } });
  const pngStory = resvgStory.render().asPng();
  fs.writeFileSync(path.join(publicDir, 'instagram-post-story.png'), pngStory);
  console.log(`✅ Gerado instagram-post-story.png (${pngStory.length} bytes)`);

  // Update wallstreet-scanner-playstore-assets.zip to also include these Instagram promotional assets
  console.log('📦 Adicionando imagens do Instagram ao pacote de assets...');
  const pythonScript = `
import zipfile, os
zip_path = 'public/wallstreet-scanner-playstore-assets.zip'
if os.path.exists(zip_path):
    with zipfile.ZipFile(zip_path, 'a', zipfile.ZIP_DEFLATED) as z:
        z.write('public/instagram-post-feed.png', 'instagram-post-feed.png')
        z.write('public/instagram-post-story.png', 'instagram-post-story.png')
    print('✅ Instagram assets added to ZIP successfully!')
`;
  fs.writeFileSync(path.join(rootDir, 'add-ig-to-zip.py'), pythonScript);
  require('child_process').execSync('python3 add-ig-to-zip.py', { cwd: rootDir });
  fs.unlinkSync(path.join(rootDir, 'add-ig-to-zip.py'));

  console.log('🎉 Todas as artes do Instagram foram geradas com sucesso!');
}

generateInstagramAssets().catch(console.error);
