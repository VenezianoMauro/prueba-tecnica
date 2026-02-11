/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gaming Brutalist color palette
        'arcade-black': '#0a0a0a',
        'arcade-dark': '#1a1a2e',
        'arcade-neon-green': '#39ff14',
        'arcade-hot-pink': '#ff1493',
        'arcade-electric-blue': '#00d4ff',
        'arcade-yellow': '#ffd700',
        'arcade-orange': '#ff6b35',
        'arcade-purple': '#bf00ff',
      },
      fontFamily: {
        'arcade': ['"Press Start 2P"', 'monospace'],
        'mono': ['Courier New', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-neon': '4px 4px 0px 0px #39ff14',
        'brutal-pink': '4px 4px 0px 0px #ff1493',
        'brutal-blue': '4px 4px 0px 0px #00d4ff',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '6': '6px',
      },
    },
  },
  plugins: [],
}
