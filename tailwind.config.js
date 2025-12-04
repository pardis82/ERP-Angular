/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,tsx,js,jsx}',
    './src/**/*.{js,mjs}', // ADD THIS
  ],

  theme: {
    extend: {
      colors: {
        'form-card': '#FBF5FB', // <<<< رنگ سفارشی شما
        'form-purple': '#E9E8FF',
        'form-darkPurple': '#A49FEC',
        'darkText-blue': '#00539C',
        pinkie: '#f3b7ad',
        'light-pinkie': '#fbe6e3',
      },
      fontFamily: {
        sans: ['YekanBakh', 'sans-serif'], // فونت شما به عنوان فونت پیش‌فرض sans-serif تنظیم می‌شود
      },
    },
  },
  plugins: [],
};
