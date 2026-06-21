import * as React from 'react';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Full name — used for initials and deterministic colour. */
  name?: string;
  /** Optional image URL. */
  src?: string | null;
  /** @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Rounded-square instead of circle. @default false */
  square?: boolean;
  style?: React.CSSProperties;
}

/** Researcher / user identity chip — image or deterministic green initials. */
export function Avatar(props: AvatarProps): JSX.Element;
