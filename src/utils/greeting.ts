export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface GreetingInfo {
  message: string;
  timeOfDay: TimeOfDay;
}

export const getGreeting = (): GreetingInfo => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { message: 'Good morning', timeOfDay: 'morning' };
  } else if (hour >= 12 && hour < 18) {
    return { message: 'Good afternoon', timeOfDay: 'afternoon' };
  } else {
    return { message: 'Good evening', timeOfDay: 'evening' };
  }
};
