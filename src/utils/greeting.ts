export type GreetingType = 'morning' | 'afternoon' | 'evening' | 'night';

export const getGreetingType = (hour: number): GreetingType => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const getGreetingMessage = (type: GreetingType): string => {
  const greetings: Record<GreetingType, string> = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    night: 'Good night',
  };
  return greetings[type];
};

export const getCurrentGreeting = (): string => {
  const hour = new Date().getHours();
  const type = getGreetingType(hour);
  return getGreetingMessage(type);
};

export const getEmptyStateMessage = (type: GreetingType): string => {
  const messages: Record<GreetingType, string> = {
    morning: 'Start your day with a new note',
    afternoon: 'Keep the momentum going',
    evening: 'Wind down with your thoughts',
    night: 'Capture your late-night ideas',
  };
  return messages[type];
};
