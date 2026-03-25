export type TicketStatus = 'open' | 'in-progress' | 'closed';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  ticketStatus?: TicketStatus;
}
