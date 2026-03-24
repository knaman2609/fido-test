import React from 'react';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import type { TicketStatus } from '@/types/note';
import './TicketBadge.css';

interface TicketBadgeProps {
  status: TicketStatus;
  size?: 'small' | 'medium';
}

const statusConfig = {
  open: {
    icon: Circle,
    label: 'Open',
    color: '#f59e0b',
  },
  'in-progress': {
    icon: Clock,
    label: 'In Progress',
    color: '#3b82f6',
  },
  closed: {
    icon: CheckCircle2,
    label: 'Closed',
    color: '#22c55e',
  },
};

export const TicketBadge: React.FC<TicketBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

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
