import * as React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'size'> {
  /** Field label above the control. */
  label?: React.ReactNode;
  /** Helper text below the field. */
  hint?: React.ReactNode;
  /** Error message — turns the field red and replaces the hint. */
  error?: React.ReactNode;
  /** Leading icon node (e.g. Lucide search). */
  iconLeft?: React.ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

/** Text field with label, leading icon, hint and error states. */
export function Input(props: InputProps): JSX.Element;
