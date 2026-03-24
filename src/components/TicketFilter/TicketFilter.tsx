import React from 'react';
import { Tag, Circle, Clock, CheckCircle2, X } from 'lucide-react';
import type { TicketStatus } from '@/types/note';
import './TicketFilter.css';

interface TicketFilterProps {
  currentFilter: TicketStatus | 'all';
  onFilterChange: (filter: TicketStatus | 'all') => void;
}

const filters: { value: TicketStatus | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All', icon: Tag },
  { value: 'open', label: 'Open', icon: Circle },
  { value: 'in-progress', label: 'In Progress', icon: Clock },
  { value: 'closed', label: 'Closed', icon: CheckCircle2 },
];

export const TicketFilter: React.FC<TicketFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="ticket-filter">
      <div className="ticket-filter__buttons">
        {filters.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            className={`ticket-filter__btn ${currentFilter === value ? 'ticket-filter__btn--active' : ''}`}
            onClick={() => onFilterChange(value)}
            aria-label={`Filter by ${label}`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
