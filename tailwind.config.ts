import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/theme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Modern Design System Colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Glass morphism colors
        glass: {
          DEFAULT: 'hsla(var(--glass))',
          light: 'hsla(var(--glass-light))',
          dark: 'hsla(var(--glass-dark))',
        },
        // Gradient colors
        gradient: {
          from: 'hsl(var(--gradient-from))',
          via: 'hsl(var(--gradient-via))',
          to: 'hsl(var(--gradient-to))',
        },
        // HeyZack Brand Colors (legacy support)
        'heyzack': {
          charcoal: '#1D1D1B',
          white: '#FFFFFF',
          gray: '#F8F9FA',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        // Legacy support
        'brinnan': ['Brinnan', 'sans-serif'],
        'avenir': ['Avenir', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'float': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
         // Gradient animations
         'gradient-x': 'gradient-x 15s ease infinite',
         'gradient-y': 'gradient-y 15s ease infinite',
         'gradient-xy': 'gradient-xy 15s ease infinite',
         // Float and hover animations
         'float': 'float 6s ease-in-out infinite',
         'float-slow': 'float 8s ease-in-out infinite',
         'float-fast': 'float 4s ease-in-out infinite',
         // Glass morphism animations
         'glass-float': 'glass-float 6s ease-in-out infinite',
         'shimmer': 'shimmer 2s linear infinite',
         // Navigation animations
         'slide-in-left': 'slide-in-left 0.3s ease-out',
         'slide-out-left': 'slide-out-left 0.3s ease-in',
         'fade-in': 'fade-in 0.2s ease-out',
         'fade-out': 'fade-out 0.2s ease-in',
         // Interactive animations
         'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
         'bounce-subtle': 'bounce-subtle 1s ease-in-out',
       },
      keyframes: {
         // Gradient keyframes
         'gradient-y': {
           '0%, 100%': {
             transform: 'translateY(0%)',
           },
           '50%': {
             transform: 'translateY(-100%)',
           },
         },
         'gradient-x': {
           '0%, 100%': {
             transform: 'translateX(0%)',
           },
           '50%': {
             transform: 'translateX(-100%)',
           },
         },
         'gradient-xy': {
           '0%, 100%': {
             transform: 'translate(0%, 0%)',
           },
           '25%': {
             transform: 'translate(-100%, 0%)',
           },
           '50%': {
             transform: 'translate(-100%, -100%)',
           },
           '75%': {
             transform: 'translate(0%, -100%)',
           },
         },
         // Float keyframes
         'float': {
           '0%, 100%': {
             transform: 'translateY(0px)',
           },
           '50%': {
             transform: 'translateY(-20px)',
           },
         },
         'glass-float': {
           '0%, 100%': {
             transform: 'translateY(0px) scale(1)',
           },
           '50%': {
             transform: 'translateY(-10px) scale(1.02)',
           },
         },
         // Shimmer effect
         'shimmer': {
           '0%': {
             backgroundPosition: '-200% 0',
           },
           '100%': {
             backgroundPosition: '200% 0',
           },
         },
         // Navigation keyframes
         'slide-in-left': {
           '0%': {
             transform: 'translateX(-100%)',
             opacity: '0',
           },
           '100%': {
             transform: 'translateX(0)',
             opacity: '1',
           },
         },
         'slide-out-left': {
           '0%': {
             transform: 'translateX(0)',
             opacity: '1',
           },
           '100%': {
             transform: 'translateX(-100%)',
             opacity: '0',
           },
         },
         'fade-in': {
           '0%': {
             opacity: '0',
           },
           '100%': {
             opacity: '1',
           },
         },
         'fade-out': {
           '0%': {
             opacity: '1',
           },
           '100%': {
             opacity: '0',
           },
         },
         // Interactive keyframes
         'pulse-glow': {
           '0%, 100%': {
             boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
           },
           '50%': {
             boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
           },
         },
         'bounce-subtle': {
           '0%, 100%': {
             transform: 'translateY(0)',
           },
           '50%': {
             transform: 'translateY(-5px)',
           },
         },
       },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: '#0a0a0a',
            foreground: '#ffffff',
            primary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e',
              DEFAULT: '#0ea5e9',
              foreground: '#ffffff',
            },
            secondary: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
              DEFAULT: '#64748b',
              foreground: '#ffffff',
            },
          },
        },
        light: {
          colors: {
            background: '#ffffff',
            foreground: '#1D1D1B',
            primary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e',
              DEFAULT: '#0ea5e9',
              foreground: '#ffffff',
            },
            secondary: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
              DEFAULT: '#f1f5f9',
              foreground: '#1D1D1B',
            },
          },
        },
      },
    }),
  ],
};

export default config;