import * as React from 'react';

export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  value?: number;
  max?: number;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  /** Animated sweep for unknown duration. @default false */
  indeterminate?: boolean;
  label?: React.ReactNode;
  /** Show percentage on the right. @default false */
  showValue?: boolean;
  style?: React.CSSProperties;
}

/** Harvest / scrape progress bar — determinate or indeterminate. */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
