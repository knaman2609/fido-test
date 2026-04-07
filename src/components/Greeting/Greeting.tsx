import React, { useState, useEffect } from 'react';
import { Sun, Sunset, Moon } from 'lucide-react';
import { getGreeting, type TimeOfDay } from '@/utils/greeting';
import './Greeting.css';

const getIcon = (timeOfDay: TimeOfDay) => {
  switch (timeOfDay) {
    case 'morning':
      return <Sun size={20} className="greeting__icon greeting__icon--morning" />;
    case 'afternoon':
      return <Sunset size={20} className="greeting__icon greeting__icon--afternoon" />;
    case 'evening':
      return <Moon size={20} className="greeting__icon greeting__icon--evening" />;
  }
};

export const Greeting: React.FC = () => {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="greeting">
      {getIcon(greeting.timeOfDay)}
      <span className="greeting__text">{greeting.message}</span>
    </div>
  );
};
