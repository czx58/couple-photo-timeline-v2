/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 温暖厨房色调
        kitchen: {
          cream: '#FFF8F0',   // 米白背景
          warm: '#FFE8D6',    // 暖橙淡
          accent: '#E8734A',  // 橙色主调
          dark: '#3D2B1F',    // 深棕文字
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
