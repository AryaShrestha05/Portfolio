/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ===================
      // COLOR SYSTEM
      // ===================
      // All colors use CSS variables for easy theme switching
      // Light mode: black text on white background
      // Dark mode: white text on black background
      colors: {
        // Primary semantic colors
        foreground: 'var(--color-foreground)',
        background: 'var(--color-background)',

        // Muted/secondary colors
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },

        // Card colors
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },

        // Border color
        border: 'var(--color-border)',

        // Accent color (for highlights, links, buttons)
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },

        // Additional semantic colors
        primary: {
          DEFAULT: 'var(--color-foreground)',
          foreground: 'var(--color-background)',
        },
        secondary: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
      },

      // ===================
      // TYPOGRAPHY
      // ===================
      fontFamily: {
        primary: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },

      // ===================
      // BORDER RADIUS
      // ===================
      borderRadius: {
        'card': '3rem',
        'card-sm': '2.5rem',
        'card-xs': '1.5rem',
      },

      // ===================
      // BOX SHADOW
      // ===================
      boxShadow: {
        'card': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 12px 48px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
      },

      // ===================
      // CONTAINER
      // ===================
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },

      // ===================
      // ANIMATIONS
      // ===================
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
