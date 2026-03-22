import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        price: 'var(--color-price)',
        sale: 'var(--color-sale)',
        whatsapp: 'var(--color-whatsapp)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'kids-accent': 'var(--color-kids-accent)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)'
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        display: ['clamp(42px,6vw,64px)', { lineHeight: '1.1' }],
        h1: ['clamp(32px,4.5vw,48px)', { lineHeight: '1.2' }],
        h2: ['clamp(26px,3.5vw,36px)', { lineHeight: '1.25' }],
        h3: ['18px', { lineHeight: '1.4' }],
        body: ['16px', { lineHeight: '1.55' }],
        small: ['13px', { lineHeight: '1.4' }],
        micro: ['12px', { lineHeight: '1.5' }]
      },
      borderRadius: {
        card: '12px',
        pill: '100px',
        input: '8px'
      },
      aspectRatio: {
        product: '3 / 4'
      }
    }
  },
  plugins: []
};

export default config;
