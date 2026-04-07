import React from 'react';
import { useGreeting } from '@/hooks/useGreeting';
import './Greeting.css';

interface GreetingProps {
  className?: string;
}

export const Greeting: React.FC<GreetingProps> = ({ className = '' }) => {
  const { greeting } = useGreeting();

  return (
    <h1 className={`greeting ${className}`} aria-label={greeting}>
      <span className="greeting__text">{greeting}</span>
    </h1>
  );
};
