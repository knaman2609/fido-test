import React from 'react';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import type { TicketStatus } from '@/types/note';
import { ticketStatusConfig } from '@/types/note';
import './TicketBadge.css';

interface TicketBadgeProps {
  status: TicketStatus;
  size?: 'small' | 'medium';
}

const iconMap = {
  open: Circle,
  'in-progress': Clock,
  closed: CheckCircle2,
};

export const TicketBadge: React.FC<TicketBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const config = ticketStatusConfig[status];
  const Icon = iconMap[status];

  return (
    <span
      className={`ticket-badge ticket-badge--${status} ticket-badge--${size}`}
      style={{ color: config.color }}
      title={`Status: ${config.label}`}
    >
      <Icon size={size === 'small' ? 12 : 14} />
      <span className="ticket-badge__label">{config.label}</span>
    </span>
  );
};
