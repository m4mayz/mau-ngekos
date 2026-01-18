/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.tsx",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Manrope", "sans-serif"],
                manrope: ["Manrope", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: "#1b988d",
                    50: "#E8F7F6",
                    100: "#D1EFED",
                    200: "#A3DFDB",
                    300: "#75CFC9",
                    400: "#47BFB7",
                    500: "#1b988d",
                    600: "#167A71",
                    700: "#115C55",
                    800: "#0B3E39",
                    900: "#06201D",
                },
                secondary: {
                    DEFAULT: "#E86A4A",
                    50: "#FEF2EF",
                    100: "#FDE5DF",
                    200: "#FBCBBF",
                    300: "#F9B19F",
                    400: "#F7977F",
                    500: "#E86A4A",
                    600: "#D94E2B",
                    700: "#B03D21",
                    800: "#7A2A17",
                    900: "#44180D",
                },
            },
        },
    },
    plugins: [],
};
