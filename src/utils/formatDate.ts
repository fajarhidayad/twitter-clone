import { formatDistanceToNow, format } from 'date-fns';

export function formatDate(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.round(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );
  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInMinutes < 24 * 60) {
    return `${Math.round(diffInMinutes / 60)}h`;
  } else {
    return format(date, 'd MMM');
  }
}

export function formatDateDetails(date: Date) {
  const formattedDate = format(date, 'h:mm a · d MMM yyy');
  return formattedDate;
}
