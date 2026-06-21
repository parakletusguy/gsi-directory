import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Button label / content. */
  children?: React.ReactNode;
  /** Visual style. @default 'primary' */
  variant?: ButtonVariant;
  /** Control size. @default 'md' */
  size?: ButtonSize;
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Show spinner and disable. @default false */
  loading?: boolean;
  /** Stretch to container width. @default false */
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

/**
 * Primary action control for GSID. Brand-green primary, outline secondary,
 * green ghost, brick danger. Use one primary per view.
 */
export function Button(props: ButtonProps): JSX.Element;
