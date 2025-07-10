

import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'tan-mon-cheri': ['Tan Mon Cheri', 'serif'],
				'poppins': ['Poppins', 'sans-serif'],
				'bauer-bodoni': ['Bauer Bodoni', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Paleta 3 colors
				beige: {
					50: 'hsl(35 50% 95%)',
					100: 'hsl(35 40% 90%)',
					200: 'hsl(35 35% 85%)',
					300: 'hsl(35 31% 81%)',
					400: 'hsl(35 31% 77%)',
					500: 'hsl(35 31% 73%)', // #E6D0BB
					600: 'hsl(35 25% 65%)',
					700: 'hsl(35 20% 55%)',
					800: 'hsl(35 15% 45%)',
					900: 'hsl(35 10% 35%)',
				},
				gold: {
					50: 'hsl(35 60% 90%)',
					100: 'hsl(35 55% 80%)',
					200: 'hsl(35 50% 70%)',
					300: 'hsl(35 45% 65%)',
					400: 'hsl(35 40% 60%)',
					500: 'hsl(35 36% 55%)', // #A87F49
					600: 'hsl(35 36% 50%)',
					700: 'hsl(35 36% 45%)',
					800: 'hsl(35 36% 35%)',
					900: 'hsl(35 36% 25%)',
				},
				sage: {
					50: 'hsl(100 35% 90%)',
					100: 'hsl(100 30% 85%)',
					200: 'hsl(100 25% 80%)',
					300: 'hsl(100 25% 75%)',
					400: 'hsl(100 25% 70%)',
					500: 'hsl(100 25% 67%)', // #9EC290
					600: 'hsl(100 20% 60%)',
					700: 'hsl(100 15% 50%)',
					800: 'hsl(100 10% 40%)',
					900: 'hsl(100 5% 30%)',
				},
				forest: {
					50: 'hsl(85 25% 85%)',
					100: 'hsl(85 20% 75%)',
					200: 'hsl(85 18% 65%)',
					300: 'hsl(85 17% 55%)',
					400: 'hsl(85 16% 45%)',
					500: 'hsl(85 15% 40%)', // #506F3F
					600: 'hsl(85 15% 35%)',
					700: 'hsl(85 15% 30%)',
					800: 'hsl(85 15% 25%)',
					900: 'hsl(85 15% 20%)',
				},
				darkgreen: {
					50: 'hsl(76 25% 85%)',
					100: 'hsl(76 24% 75%)',
					200: 'hsl(76 23% 65%)',
					300: 'hsl(76 23% 55%)',
					400: 'hsl(76 22% 45%)',
					500: 'hsl(76 22% 35%)',
					600: 'hsl(76 22% 25%)',
					700: 'hsl(76 22% 20%)',
					800: 'hsl(76 22% 15%)', // #313D25
					900: 'hsl(76 22% 10%)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in-left': 'slide-in-left 0.8s ease-out',
				'float': 'float 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

