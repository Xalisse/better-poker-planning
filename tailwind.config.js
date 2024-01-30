/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        colors: {
            transparent: 'transparent',
            white: '#FCFCFC',
            black: '#000000',
            'extra-light-primary': '#FFF8FD',
            'light-primary': '#FFDBF3',
            primary: '#F2B6DE',
            'dark-primary': '#EB82C9',
            'extra-dark-primary': '#953275',
            'extra-light-secondary': '#FFFBF8',
            'light-secondary': '#FFE9DB',
            secondary: '#FFD8C0',
            'dark-secondary': '#FFB98E',
            'extra-dark-secondary': '#C47341',
            'extra-light-tertiary': '#FAF9FF',
            'light-tertiary': '#E5DFFF',
            tertiary: '#C5BBEE',
            'dark-tertiary': '#9C8BE4',
            'extra-dark-tertiary': '#483887',
        },
        extend: {
            fontFamily: {
                sans: ['Comfortaa', 'sans-serif'],
                Montserrat: ['Comfortaa', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
