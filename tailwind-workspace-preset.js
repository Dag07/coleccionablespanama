// tailwind-workspace-preset.js

module.exports = {
  theme: {
    extend: {
      spacing: {
        // Scale down default spacing slightly for more compact look
        '0.5': '0.1rem',
        '1': '0.22rem',
        '1.5': '0.33rem',
        '2': '0.44rem',
        '2.5': '0.55rem',
        '3': '0.66rem',
        '3.5': '0.77rem',
        '4': '0.88rem',
        '5': '1.1rem',
        '6': '1.32rem',
        '8': '1.76rem',
        '10': '2.2rem',
        '12': '2.64rem',
        '16': '3.52rem',
        '20': '4.4rem',
        '24': '5.28rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};