import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

export const formatDate = (date: Date): string => {
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff < 7) {
    return format(date, 'EEEE');
  }
  return format(date, 'MMM d, yyyy');
};

export const formatFullDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy h:mm a');
};
