import * as React from 'react';

export type IconButtonVariant = 'ghost' | 'solid' | 'outline';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Icon node (e.g. a Lucide <i data-lucide="…"/>). */
  children?: React.ReactNode;
  /** Visual style. @default 'ghost' */
  variant?: IconButtonVariant;
  /** Size. @default 'md' */
  size?: IconButtonSize;
  /** Accessible label (also the tooltip title). */
  label?: string;
  style?: React.CSSProperties;
}

/** Square icon-only control for toolbars, table rows, and dialog close. */
export function IconButton(props: IconButtonProps): JSX.Element;
