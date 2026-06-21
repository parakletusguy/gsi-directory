import * as React from 'react';

export type AgentState = 'idle' | 'running' | 'done' | 'error';

export interface AgentStatusProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Agent name, e.g. "API Harvester". */
  name?: React.ReactNode;
  /** Short role / description. */
  role?: React.ReactNode;
  /** Live state. @default 'idle' */
  state?: AgentState;
  /** Icon node (Lucide). */
  icon?: React.ReactNode;
  /** Extra trailing detail in the sub-line. */
  detail?: React.ReactNode;
  /** Progress 0–100, or null to hide the bar. @default null */
  progress?: number | null;
  style?: React.CSSProperties;
}

/** Row representing one multi-agent pipeline worker with live state + progress. */
export function AgentStatus(props: AgentStatusProps): JSX.Element;
