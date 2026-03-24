export type TicketStatus = 'open' | 'in-progress' | 'closed';

export interface TicketStatusConfig {
  icon: React.ElementType;
  label: string;
  color: string;
}

export const ticketStatusConfig: Record<TicketStatus, TicketStatusConfig> = {
  open: {
    icon: 'Circle',
    label: 'Open',
    color: '#f59e0b',
  },
  'in-progress': {
    icon: 'Clock',
    label: 'In Progress',
    color: '#3b82f6',
  },
  closed: {
    icon: 'CheckCircle2',
    label: 'Closed',
    color: '#22c55e',
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
