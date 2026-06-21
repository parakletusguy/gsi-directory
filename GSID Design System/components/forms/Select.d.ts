import * as React from 'react';

export type SelectOption = string | { value: string; label: string };

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'style' | 'size'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** Options as strings or {value,label} objects. */
  options?: SelectOption[];
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

/** Styled native select with label, chevron and error state. */
export function Select(props: SelectProps): JSX.Element;
