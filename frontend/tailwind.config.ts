import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: '#9B6FD4',
        pink: '#F472B6',
        lavender: '#C4B5FD',
        mint: '#6EE7B7',
        peach: '#FDBA74',
        sky: '#93C5FD',
        blush: '#FFF6F9',
        cream: '#FDF4EC',
        plum: '#3D1F5C',
        muted: '#8B7BA8',
        gold: '#F59E0B',
        error: '#F87171',
        success: '#22C55E',
      },
      fontFamily: {
        display: ['Bubblegum Sans', 'Comic Sans MS', 'cursive'],
        heading: ['Fredoka', 'Trebuchet MS', 'sans-serif'],
        body: ['Nunito', 'Verdana', 'sans-serif'],
        // Aliases used in components
        fredoka: ['Fredoka', 'Trebuchet MS', 'sans-serif'],
        nunito: ['Nunito', 'Verdana', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '32px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(155,111,212,0.08)',
        md: '0 4px 16px rgba(155,111,212,0.12)',
        lg: '0 8px 32px rgba(155,111,212,0.18)',
        hover: '0 12px 40px rgba(155,111,212,0.24)',
      },
      maxWidth: {
        container: '1280px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(6deg)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
