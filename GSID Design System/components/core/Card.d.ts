import * as React from 'react';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: React.ReactNode;
  /** Inner padding. @default 'md' */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Hover-raise + pointer cursor. @default false */
  interactive?: boolean;
  /** Start at md elevation. @default false */
  raised?: boolean;
  style?: React.CSSProperties;
}

export interface CardHeaderProps {
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * White surface container — hairline border, soft green-tinted shadow, 14px radius.
 */
export function Card(props: CardProps): JSX.Element;
export function CardHeader(props: CardHeaderProps): JSX.Element;
