export type TicketStatus = 'open' | 'in-progress' | 'closed';

export interface TicketStatusConfig {
  label: string;
  color: string;
}

export const ticketStatusConfig: Record<TicketStatus, TicketStatusConfig> = {
  open: {
    label: 'Open',
    color: '#f59e0b',
  },
  'in-progress': {
    label: 'In Progress',
    color: '#3b82f6',
  },
  closed: {
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
