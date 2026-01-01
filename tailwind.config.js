/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: 'var(--color-bg-primary)',
                    secondary: 'var(--color-bg-secondary)',
                    tertiary: 'var(--color-bg-tertiary)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    placeholder: 'var(--color-text-placeholder)',
                },
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    pop: 'var(--color-accent-pop)',
                },
                success: 'var(--color-success)',
                error: 'var(--color-error)',
            },
            fontFamily: {
                base: 'var(--font-family-base)',
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                full: 'var(--radius-full)',
            },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                float: 'var(--shadow-float)',
            }
        },
    },
    plugins: [],
}
