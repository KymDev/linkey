import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base
        dark:    '#0a0a0f',
        darker:  '#06060a',

        // Accent principal
        accent:  {
          DEFAULT: '#7C6FFF',
          light:   '#9c8fff',
          dark:    '#5a4fcc',
        },

        // Accents secundários
        pink:    '#FF6FBD',
        cyan:    '#6FFFE9',
        gold:    '#FFD580',

        // Glass
        glass: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong:  'rgba(255,255,255,0.14)',
          border:  'rgba(255,255,255,0.12)',
        },
      },

      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Helvetica Neue',
          'sans-serif',
        ],
      },

      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '28px',
      },

      backdropBlur: {
        glass: '20px',
      },

      boxShadow: {
        glass:       '0 8px 32px rgba(0,0,0,0.35)',
        'glass-lg':  '0 20px 60px rgba(0,0,0,0.45)',
        'accent':    '0 4px 24px rgba(124,111,255,0.4)',
        'accent-lg': '0 8px 40px rgba(124,111,255,0.5)',
      },

      animation: {
        'fade-up':    'fadeUp 0.4s ease both',
        'fade-in':    'fadeIn 0.3s ease both',
        'scale-in':   'scaleIn 0.25s ease both',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },

      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
