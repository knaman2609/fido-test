import { Circle, Clock, CheckCircle2, type LucideIcon } from 'lucide-react';

export type TicketStatus = 'open' | 'in-progress' | 'closed';

export interface TicketStatusConfig {
  label: string;
  color: string;
  icon: LucideIcon;
}

export const ticketStatusConfig: Record<TicketStatus, TicketStatusConfig> = {
  open: {
    label: 'Open',
    color: '#f59e0b',
    icon: Circle,
  },
  'in-progress': {
    label: 'In Progress',
    color: '#3b82f6',
    icon: Clock,
  },
  closed: {
    label: 'Closed',
    color: '#22c55e',
    icon: CheckCircle2,
  },
};

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isTicket?: boolean;
  ticketStatus?: TicketStatus;
}
