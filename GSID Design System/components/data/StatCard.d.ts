import * as React from 'react';

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Headline value (string or number) — rendered in Coolvetica. */
  value?: React.ReactNode;
  /** Uppercase overline label. */
  label?: React.ReactNode;
  /** Secondary delta line in mono. */
  delta?: React.ReactNode;
  deltaTone?: 'success' | 'danger' | 'warning' | 'neutral';
  /** Trailing icon node. */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Headline metric tile — big display number with overline label and delta. */
export function StatCard(props: StatCardProps): JSX.Element;
