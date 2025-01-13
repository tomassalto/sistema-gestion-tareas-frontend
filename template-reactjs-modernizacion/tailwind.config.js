/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                Nobile: ["Nobile", "sans-serif"],
                Muli: ["Muli", "sans-serif"],
                Merriweather: ["Merriweather", "serif"],
                montserrat: ["Montserrat", "sans-serif"],
            },
        },
    },
    plugins: [],
}
