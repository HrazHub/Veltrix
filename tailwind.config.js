/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg)',
        panel: 'var(--bg-secondary)',
        card: 'var(--card)',
        elevated: 'var(--elevated)',
        accent: 'var(--accent)',
        accent2: 'var(--accent-2)',
        primary: 'var(--text)',
        muted: 'var(--text-muted)',
        line: 'var(--line)'
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk Variable', 'Space Grotesk', 'Inter Variable', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px -8px var(--accent-glow)',
        card: '0 24px 60px -24px rgba(0,0,0,.65)'
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,.028) 1px, transparent 1px)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
