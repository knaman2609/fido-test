import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

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
    <div className="search-bar">
      <Search className="search-bar__icon" size={16} />
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search"
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
