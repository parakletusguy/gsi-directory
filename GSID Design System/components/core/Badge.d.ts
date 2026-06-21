import * as React from 'react';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeVariant = 'soft' | 'solid' | 'outline';

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: React.ReactNode;
  /** Semantic tone. @default 'neutral' */
  tone?: BadgeTone;
  /** Fill style. @default 'soft' */
  variant?: BadgeVariant;
  /** Show a leading status dot. @default false */
  dot?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/** Compact status / count pill for table cells, headers, and source rows. */
export function Badge(props: BadgeProps): JSX.Element;
