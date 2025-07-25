/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // App Router 구조
    "./pages/**/*.{js,ts,jsx,tsx}", // (혼용 시)
    "./components/**/*.{js,ts,jsx,tsx}", // 공통 컴포넌트
    "./src/**/*.{js,ts,jsx,tsx}", // 전체 커버
  ],
  theme: {
    extend: {
      fontFamily: {
        paperlogy: ["PaperlogyRegular", "sans-serif"],
        paperlogyBold: ["PaperlogyBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
