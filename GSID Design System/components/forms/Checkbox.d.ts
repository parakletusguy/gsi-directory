import * as React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'onChange'> {
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

/** Checkbox with label and optional description — for source selection lists. */
export function Checkbox(props: CheckboxProps): JSX.Element;
