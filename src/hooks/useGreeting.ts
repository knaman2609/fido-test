import { useState, useEffect, useMemo } from 'react';
import { getCurrentGreeting, getGreetingType, getEmptyStateMessage, GreetingType } from '@/utils/greeting';

interface UseGreetingReturn {
  greeting: string;
  greetingType: GreetingType;
  emptyStateMessage: string;
}

export const useGreeting = (): UseGreetingReturn => {
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const updateHour = () => {
      const currentHour = new Date().getHours();
      setHour((prevHour) => {
        if (currentHour !== prevHour) {
          return currentHour;
        }
        return prevHour;
      });
    };

    updateHour();
    const interval = setInterval(updateHour, 60000);

    return () => clearInterval(interval);
  }, []);

  const greetingType = useMemo(() => getGreetingType(hour), [hour]);
  const greeting = useMemo(() => getCurrentGreeting(), [hour]);
  const emptyStateMessage = useMemo(() => getEmptyStateMessage(greetingType), [greetingType]);

  return {
    greeting,
    greetingType,
    emptyStateMessage,
  };
};
