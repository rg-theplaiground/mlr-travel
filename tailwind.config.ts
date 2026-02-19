/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Onest"', 'sans-serif'],
            },
            colors: {
                mlr: {
                    red: '#CE0E2D',
                    dark: '#0A0A0A',
                    gray: '#F3F4F6',
                    surface: '#FFFFFF',
                    border: '#E5E7EB',
                    platinum: '#E2E2E2'
                },
                hyrox: {
                    bg: '#FFFFFF',
                    charcoal: '#FFFFFF',
                    yellow: '#CE0E2D',
                    gray: '#F3F4F6',
                }
            },
            boxShadow: {
                'soft': '0 20px 40px -10px rgba(0,0,0,0.05)',
                'gloss': 'inset 0 1px 0 0 rgba(255,255,255,0.7)',
                'float': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
