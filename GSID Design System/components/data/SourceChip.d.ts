import * as React from 'react';

export interface SourceChipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Source name, e.g. "OpenAlex". */
  name?: React.ReactNode;
  /** Access type. @default 'api' */
  type?: 'api' | 'scrape';
  /** Health dot. @default 'online' */
  health?: 'online' | 'degraded' | 'offline';
  /** Optional record count. */
  count?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Data-source pill with access type and health dot (OpenAlex, DOAJ, AJOL…). */
export function SourceChip(props: SourceChipProps): JSX.Element;
