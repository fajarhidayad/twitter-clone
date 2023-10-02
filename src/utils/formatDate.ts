import { formatDistanceToNow, isBefore, subDays } from 'date-fns';

export const formatDate = (date: Date) => {
  if (isBefore(date, subDays(new Date(), 30))) {
    return date.toLocaleDateString();
  } else {
    const distance = formatDistanceToNow(date, { addSuffix: true });

    if (distance.includes('seconds')) {
      return distance.replace(' seconds', 's');
    } else if (distance.includes(' minutes')) {
      return distance.replace(' minutes', 'm');
    } else if (distance.includes(' hours')) {
      return distance.replace(' hours', 'h');
    } else {
      return distance;
    }
  }
};
