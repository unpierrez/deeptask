import type { Priority } from '../types';

// CSS custom properties from styles/tokens.css — usable directly in :style bindings
export const PRIORITY_COLORS: Record<Priority, string> = {
  alta: 'var(--prio-alta)',
  media: 'var(--prio-media)',
  baixa: 'var(--prio-baixa)',
};
