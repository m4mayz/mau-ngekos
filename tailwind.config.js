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
                    DEFAULT: "#6366F1",
                    50: "#EDEFFD",
                    100: "#D6D9FB",
                    200: "#AEB4F7",
                    300: "#868EF3",
                    400: "#6366F1",
                    500: "#4238ED",
                    600: "#2714D8",
                    700: "#1E10A6",
                    800: "#150B74",
                    900: "#0B0642",
                },
                secondary: {
                    DEFAULT: "#10B981",
                    50: "#E6FBF4",
                    100: "#CDF7E9",
                    200: "#9BEFD3",
                    300: "#69E7BD",
                    400: "#37DFA7",
                    500: "#10B981",
                    600: "#0D9668",
                    700: "#0A724F",
                    800: "#074F36",
                    900: "#032B1D",
                },
            },
        },
    },
    plugins: [],
};
