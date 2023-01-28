module.exports = {
  content: ["./**/*.{html,js,json}"],
  theme: {
    extend: {
        colors: {
            base: '#0C0032',
            custom:{
                green: '#2fce44'
            },
            gr1:{
                1: '#8E2DE2',
                2: '#4A00E0',
                3: '#60a5fa'
            },
            gr2: {
                1: '#fc4a1a',
                2: '#f7b733'
            },
            gr3: {
                1: '#00b09b',
                2: '#96c93d'
            },
            gr4: {
                1: '#7F00FF',
                2: '#E100FF'
            },
            gr5: {
                1: '#136a8a',
                2: '#267871'
            },
            gr6: {
                1: '#22c1c3',
                2: '#fdbb2d'
            },
            gr7: {
                1: '#FC466B',
                2: '#3F5EFB'
            },
            gr8: {
                1: '#A770EF',
                2: '#CF8BF3',
                3: '#FDB99B'
            },
        },
        fontFamily : {
            baloo: ["'Baloo Bhaijaan 2'", 'sans-serif'],
            nunito: ["'Nunito'", 'sans-serif'],
            sans: ["'Open Sans'", 'sans-serif'],
            mono: ["'Roboto Mono'", 'monospace']
        },
        animation: {
            stars: 'shooting-star linear infinite',
            blink: 'blink 1.2s linear infinite',
            gradient: 'gradient 4s linear infinite',
            'fade-l': 'fade-l 0.6s ease-out',
            'fade-r': 'fade-r 0.6s ease-out',
            'fade-b': 'fade-b 0.6s ease-out'
        },
        keyframes: {
            'shooting-star': {
                '0%': {
                    transform: 'rotate(210deg) translateX(0)',
                    opacity: '0.8'
                },
                '100%': {
                    transform: 'rotate(210deg) translateX(-100vw)',
                    opacity: '0'
                }
            },
            'blink': {
                '0%, 29%, 81%, 100%': {
                    opacity: '1'
                },
                '30%, 80%': {
                    opacity: '0'
                }
            },
            'gradient': {
                '0%, 100%': {
                    'background-position': '0% 50%',
                    'background-size': '300%'
                },
                '50%': {
                    'background-position': '100% 50%',
                    'background-size': '300%'
                }
            },
            'fade-l': {
                '0%': {
                    transform: 'translateX(-70vw)',
                    opacity: '0.1'
                },
                '100%': {
                    transform: 'none',
                    opacity: '1'
                }
            },
            'fade-r': {
                '0%': {
                    transform: 'translateX(70vw)',
                    opacity: '0.1'
                },
                '100%': {
                    transform: 'none',
                    opacity: '1'
                }
            },
            'fade-b': {
                '0%': {
                    transform: 'translateY(70vh)',
                    opacity: '0.1'
                },
                '100%': {
                    transform: 'none',
                    opacity: '1'
                }
            }
        }
    },
    screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
    },
  },
  plugins: [],
}
