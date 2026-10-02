/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#090e1c',
        surface: '#0e1321',
        'surface-low': '#161b2a',
        'surface-card': '#1a1f2e',
        'surface-high': '#252a39',
        'surface-highest': '#303444',
        primary: '#06b6d4',
        'primary-bright': '#4cd7f6',
        secondary: '#2563eb',
        tertiary: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        'text-primary': '#dee2f6',
        'text-secondary': '#bcc9cd',
        'text-muted': '#64748b',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -2px rgba(6,182,212,0.35)',
        'glow-green': '0 0 20px -2px rgba(16,185,129,0.35)',
        'glow-red': '0 0 24px 0 rgba(239,68,68,0.45)',
        'card': '0 4px 24px -4px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        DEFAULT: '4px',
        card: '8px',
        modal: '12px',
      },
      animation: {
        'pulse-dot': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
};
