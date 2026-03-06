/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // v2 primary palette
        'smoke-blue': '#0EA5E9',
        'stackz-green': '#10B981',
        'warden-amber': '#F59E0B',
        'megaphone-pink': '#EC4899',
        'forge-indigo': '#6366F1',
        'radar-teal': '#14B8A6',
        'canvas-violet': '#A78BFA',
        'cashflow-green': '#22C55E',
        'founder-orange': '#F97316',
        // Extended neon palette
        'nebula-purple': '#7C3AED',
        'deep-violet': '#4C1D95',
        'plasma-blue': '#2563EB',
        // Glass system
        'glass-bg': 'rgba(10, 14, 26, 0.65)',
        'glass-border': 'rgba(148, 163, 184, 0.08)',
        'glass-border-smoke': 'rgba(14, 165, 233, 0.2)',
        'glass-border-stackz': 'rgba(16, 185, 129, 0.2)',
        // Base surfaces
        'hq-dark': '#060910',
        'hq-surface': '#0F172A',
        'hq-panel': '#1E293B',
        'hq-card': '#334155',
        // Legacy compatibility
        'neon-blue': '#0EA5E9',
        'neon-green': '#10B981',
        'neon-amber': '#F59E0B',
        'neon-purple': '#A78BFA',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-smoke': 'glowSmoke 2s ease-in-out infinite alternate',
        'glow-stackz': 'glowStackz 2s ease-in-out infinite alternate',
        'ticker': 'ticker 0.1s linear',
        'sync-pulse': 'syncPulse 1.5s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fluid-1': 'fluidFloat1 20s ease-in-out infinite',
        'fluid-2': 'fluidFloat2 25s ease-in-out infinite',
        'fluid-3': 'fluidFloat3 18s ease-in-out infinite',
        'blob-glow': 'blobGlow 4s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          from: { textShadow: '0 0 10px #0EA5E9, 0 0 20px #0EA5E9' },
          to: { textShadow: '0 0 20px #0EA5E9, 0 0 40px #0EA5E9, 0 0 60px #0EA5E9' },
        },
        glowSmoke: {
          from: { boxShadow: '0 0 10px rgba(14, 165, 233, 0.3)' },
          to: { boxShadow: '0 0 20px rgba(14, 165, 233, 0.6), 0 0 40px rgba(14, 165, 233, 0.2)' },
        },
        glowStackz: {
          from: { boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' },
          to: { boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.2)' },
        },
        syncPulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.05)' },
        },
        slideIn: {
          from: { transform: 'translateY(-8px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        fluidFloat1: {
          '0%':   { transform: 'translate(0%, 0%) scale(1)' },
          '25%':  { transform: 'translate(5%, -8%) scale(1.05)' },
          '50%':  { transform: 'translate(-3%, -15%) scale(0.95)' },
          '75%':  { transform: 'translate(-8%, -5%) scale(1.08)' },
          '100%': { transform: 'translate(0%, 0%) scale(1)' },
        },
        fluidFloat2: {
          '0%':   { transform: 'translate(0%, 0%) scale(1)' },
          '25%':  { transform: 'translate(-6%, 10%) scale(1.1)' },
          '50%':  { transform: 'translate(8%, 5%) scale(0.9)' },
          '75%':  { transform: 'translate(4%, -8%) scale(1.05)' },
          '100%': { transform: 'translate(0%, 0%) scale(1)' },
        },
        fluidFloat3: {
          '0%':   { transform: 'translate(0%, 0%) scale(1)' },
          '25%':  { transform: 'translate(10%, 5%) scale(0.95)' },
          '50%':  { transform: 'translate(5%, 12%) scale(1.1)' },
          '75%':  { transform: 'translate(-5%, 6%) scale(1)' },
          '100%': { transform: 'translate(0%, 0%) scale(1)' },
        },
        blobGlow: {
          '0%':   { opacity: 0.4 },
          '100%': { opacity: 0.7 },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-hover': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 30px rgba(14, 165, 233, 0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
        'smoke': '0 0 20px rgba(14, 165, 233, 0.3)',
        'stackz': '0 0 20px rgba(16, 185, 129, 0.3)',
        'neon-blue': '0 0 20px rgba(14, 165, 233, 0.3)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'neon-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
        'neon-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'luminous-blue': '0 0 40px rgba(14, 165, 233, 0.15), 0 0 80px rgba(14, 165, 233, 0.05)',
        'luminous-green': '0 0 40px rgba(16, 185, 129, 0.15), 0 0 80px rgba(16, 185, 129, 0.05)',
        'luminous-purple': '0 0 40px rgba(124, 58, 237, 0.15), 0 0 80px rgba(124, 58, 237, 0.05)',
      },
    },
  },
  plugins: [],
}
