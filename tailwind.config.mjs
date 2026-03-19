/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: 'hsl(var(--color-primary-50) / <alpha-value>)',
					100: 'hsl(var(--color-primary-100) / <alpha-value>)',
					500: 'hsl(var(--color-primary-500) / <alpha-value>)',
					600: 'hsl(var(--color-primary-600) / <alpha-value>)',
					700: 'hsl(var(--color-primary-700) / <alpha-value>)',
				},
				secondary: {
					500: 'hsl(var(--color-secondary-500) / <alpha-value>)',
				},
				accent: {
					500: 'hsl(var(--color-accent-500) / <alpha-value>)',
				},
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
		},
	},
	plugins: [],
};
