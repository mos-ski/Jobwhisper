import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: 'var(--lf-canvas)',
        surface: {
          DEFAULT: 'var(--lf-surface)',
          raised: 'var(--lf-surface-raised)',
          subtle: 'var(--lf-surface-subtle)',
          inverse: 'var(--lf-surface-inverse)',
        },
        ink: {
          DEFAULT: 'var(--lf-ink)',
          muted: 'var(--lf-ink-muted)',
        },
        border: 'var(--lf-border)',
        input: 'var(--lf-input)',
        muted: 'var(--lf-muted)',
        accent: {
          DEFAULT: 'var(--lf-accent)',
          hover: 'var(--lf-accent-hover)',
          subtle: 'var(--lf-accent-subtle)',
          muted: 'var(--lf-accent-muted)',
          text: 'var(--lf-accent-text)',
        },
        'on-accent': 'var(--lf-on-accent)',
        'accent-secondary': 'var(--lf-accent-secondary)',
        'accent-tertiary': 'var(--lf-accent-tertiary)',
        paper: 'var(--lf-paper)',
        'paper-ink': 'var(--lf-paper-ink)',
        'paper-muted': 'var(--lf-paper-muted)',
        focus: 'var(--lf-focus)',
        info: {
          DEFAULT: 'var(--lf-info)',
          surface: 'var(--lf-info-surface)',
        },
        positive: {
          DEFAULT: 'var(--lf-positive)',
          surface: 'var(--lf-positive-surface)',
        },
        warning: {
          DEFAULT: 'var(--lf-warning)',
          surface: 'var(--lf-warning-surface)',
        },
        danger: {
          DEFAULT: 'var(--lf-danger)',
          hover: 'var(--lf-danger-hover)',
          surface: 'var(--lf-danger-surface)',
        },
        'on-danger': 'var(--lf-on-danger)',
        overlay: 'var(--lf-overlay)',
        'brand-bar': {
          DEFAULT: 'var(--lf-brand-bar)',
          text: 'var(--lf-brand-bar-text)',
        },
        'brand-mark': {
          DEFAULT: 'var(--lf-brand-mark)',
          accent: 'var(--lf-brand-mark-accent)',
        },
        live: {
          canvas: 'var(--lf-live-canvas)',
          header: 'var(--lf-live-header)',
          strip: 'var(--lf-live-strip)',
          panel: 'var(--lf-live-panel)',
          border: 'var(--lf-live-border)',
          message: 'var(--lf-live-message)',
          scrim: 'var(--lf-live-scrim)',
          'avatar-neutral': 'var(--lf-live-avatar-neutral)',
          'avatar-warm': 'var(--lf-live-avatar-warm)',
          workspace: 'var(--lf-live-workspace)',
          divider: 'var(--lf-live-divider)',
          'panel-header': 'var(--lf-live-panel-header)',
          'control-border': 'var(--lf-live-control-border)',
        },
      },
      borderRadius: {
        soft: 'var(--lf-radius-soft)',
        panel: 'var(--lf-radius-panel)',
        pill: 'var(--lf-radius-pill)',
      },
      boxShadow: {
        xs: 'var(--lf-shadow-xs)',
        sm: 'var(--lf-shadow-sm)',
        panel: 'var(--lf-shadow-panel)',
        control: 'var(--lf-shadow-control)',
        popover: 'var(--lf-shadow-popover)',
        lg: 'var(--lf-shadow-lg)',
        xl: 'var(--lf-shadow-xl)',
      },
      zIndex: {
        shell: 'var(--lf-z-shell)',
        dropdown: 'var(--lf-z-dropdown)',
        sticky: 'var(--lf-z-sticky)',
        modal: 'var(--lf-z-modal)',
        overlay: 'var(--lf-z-overlay)',
        tooltip: 'var(--lf-z-tooltip)',
        toast: 'var(--lf-z-toast)',
      },
      fontSize: {
        xs: 'var(--lf-text-xs)',
        sm: 'var(--lf-text-sm)',
        base: 'var(--lf-text-base)',
        lg: 'var(--lf-text-lg)',
        xl: 'var(--lf-text-xl)',
        '2xl': 'var(--lf-text-2xl)',
        '3xl': 'var(--lf-text-3xl)',
        '4xl': 'var(--lf-text-4xl)',
      },
      lineHeight: {
        tight: 'var(--lf-leading-tight)',
        snug: 'var(--lf-leading-snug)',
        normal: 'var(--lf-leading-normal)',
        relaxed: 'var(--lf-leading-relaxed)',
      },
      letterSpacing: {
        tight: 'var(--lf-tracking-tight)',
        normal: 'var(--lf-tracking-normal)',
        wide: 'var(--lf-tracking-wide)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        indeterminate: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 200ms ease-out',
        'accordion-up': 'accordion-up 200ms ease-out',
        indeterminate: 'indeterminate 1.5s ease-in-out infinite',
        marquee: 'marquee 18s linear infinite',
      },
      transitionDuration: {
        fast: 'var(--lf-duration-fast)',
        normal: 'var(--lf-duration-normal)',
        slow: 'var(--lf-duration-slow)',
      },
      transitionTimingFunction: {
        default: 'var(--lf-ease-default)',
        in: 'var(--lf-ease-in)',
        out: 'var(--lf-ease-out)',
        'in-out': 'var(--lf-ease-in-out)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
