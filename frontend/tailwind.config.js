/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#ff2f6a', // 핫핑크
                    hover: '#e62a60',   // 약간 어두운 핑크
                    light: '#ff5c8a',
                },
                bg: {
                    main: '#f7f7f7',    // 페이지 배경
                    card: '#ffffff',    // 카드 배경
                },
                text: {
                    main: '#222222',    // 메인 텍스트
                    sub: '#777777',     // 서브 텍스트
                    muted: '#999999',
                },
                border: {
                    DEFAULT: '#e5e5e5',
                }
            },
            borderRadius: {
                'card': '16px',
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            },
            fontFamily: {
                sans: ['Pretendard', 'Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
