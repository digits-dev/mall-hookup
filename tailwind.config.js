/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            colors: {
                "login-bg-color": "#383838",
                "login-btn-color": "#3cbfcc",
                "login-btn-color2": "#4cefff",
                "camera-color": "#342D2D",
                "screen-color": "#E8E8E8",
                "black-screen-color": "#232222",
                "black-table-color": "#312f2f",
                "status-success": "#57C769",
                "status-error": "#EF5656",
                secondary: "#797878",
                primary: "#282222",
                stroke: "9f9d9d",
                customTextGray: "#3c8dbc",
                "custom-gray": "#F5F5F5",
                "sidebar-hover-color": "#323232",
                "skin-blue-secondary": "#1e3a8a",
                "skin-blue-accent": "#425aa1",
                "skin-blue-light": "#508C9B",
                "skin-black": "#101215",
                "skin-black-secondary": "#2c3138",
                "skin-black-hover": '#31363F',
                "skin-default": "#e5e7eb",
                "menus-header-color-green": "#dff0d8",
                "menus-header-color-red": "#f2dede",
                
            },
            backgroundImage: {
                "skin-blue": "linear-gradient(to bottom right, #1e3a8a, #172554)",
                'password-gradient': 'linear-gradient(90deg, #FFD54F 0%, #FF8C00 100%)',
                'profile-gradient': 'linear-gradient(90deg, #4A90E2 0%, #6A5ACD 100%)',
                'logout-gradient': 'linear-gradient(90deg, #FF4B4B 0%, #FF6EC7 100%)',
                'change-theme-gradient': 'linear-gradient(90deg, #A259FF 0%, #4A90E2 100%)',
            },
            fontFamily: {
                "nunito-sans": ["Nunito Sans", "sans-serif"],
                "poppins": ["Poppins", "sans-serif"],
            },
            boxShadow: {
                custom: "0 2px 10px rgba(0, 0, 0, 0.1)",
                menus: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                menuchild: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                customLight: '0px 2px 8px 0px rgba(99, 99, 99, 0.2)',
            },
            keyframes: {
                slideLeft: {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(-100%)' },
                },
                slideInFromLeft: {
                  '0%': { transform: 'translateX(-100%)' },
                  '100%': { transform: 'translateX(0)' },
                },
              },
              animation: {
                slideLeft: 'slideLeft 0.5s ease-in-out',
                slideInFromLeft: 'slideInFromLeft 0.5s ease-in-out',
            },
            zIndex: {
                '100': '100',
                '110': '110',
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
};
