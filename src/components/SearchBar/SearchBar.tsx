import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg",
        "bg-secondary/50 transition-colors",
        "focus-within:bg-secondary"
      )}
    >
      <Search className={cn("w-4 h-4 text-muted-foreground shrink-0")} />
      <input
        type="text"
        className={cn(
          "flex-1 bg-transparent text-sm text-foreground outline-none",
          "placeholder:text-muted-foreground"
        )}
        placeholder="Search"
        value={value}
        onChange={handleChange}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-5 w-5 rounded-full hover:bg-secondary-foreground/20")}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={14} className={cn("text-muted-foreground")} />
        </Button>
      )}
    </div>
  );
};
