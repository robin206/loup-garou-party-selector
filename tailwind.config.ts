import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config = {
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
        werewolf: {
          '100': '#f5f5f5',
          '200': '#e5e5e5',
          '300': '#d4d4d4',
          '400': '#a3a3a3',
          '500': '#737373',
          '600': '#525252',
          '700': '#404040',
          '800': '#262626',
          '900': '#171717',
          '950': '#0a0a0a',
          'accent': '#ea384c',
          'night': '#1e1b4b',
          'blood': '#9f1239'
        },
        "werewolf-accent": "#9b87f5",
        "werewolf-primary": "#6E59A5",
        "werewolf-secondary": "#D6BCFA",
        "werewolf-blood": "#ea384c",
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
            opacity: '0' 
          },
          '100%': { 
            opacity: '1' 
          }
        },
        'fade-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(10px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        },
        'pulse-subtle': {
          '0%, 100%': { 
            opacity: '1',
            transform: "scale(1)",
          },
          '50%': { 
            opacity: "0.92",
            transform: "scale(1.03)",
          },
        },
        'wild-child-transformation': {
          '0%': {
            filter: "none",
            transform: "scale(1) rotate(0deg)",
          },
          '10%': {
            filter: "hue-rotate(60deg) brightness(1.2)",
            transform: "scale(1.1) rotate(5deg)",
          },
          '20%': {
            filter: "hue-rotate(-30deg) brightness(0.8)",
            transform: "scale(0.95) rotate(-5deg)",
          },
          '30%': {
            filter: "hue-rotate(120deg) brightness(1.3)",
            transform: "scale(1.15) rotate(10deg)",
          },
          '40%': {
            filter: "hue-rotate(-60deg) brightness(0.7)",
            transform: "scale(0.9) rotate(-10deg)",
          },
          '50%': {
            filter: "hue-rotate(180deg) brightness(1.4)",
            transform: "scale(1.2) rotate(15deg)",
          },
          '60%': {
            filter: "hue-rotate(-90deg) brightness(0.6)",
            transform: "scale(0.85) rotate(-15deg)",
          },
          '70%': {
            filter: "hue-rotate(240deg) brightness(1.3)",
            transform: "scale(1.15) rotate(10deg)",
          },
          '80%': {
            filter: "hue-rotate(-120deg) brightness(0.7)",
            transform: "scale(0.9) rotate(-5deg)",
          },
          '90%': {
            filter: "hue-rotate(300deg) brightness(1.1)",
            transform: "scale(1.05) rotate(2deg)",
          },
          '100%': {
            filter: "hue-rotate(0deg) brightness(1)",
            transform: "scale(1) rotate(0deg)",
          },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'wild-child-transformation': 'wild-child-transformation 20s ease-in-out',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
