import { CalendarEvent } from '../../utils/types';
import { add, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, differenceInHours } from 'date-fns';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A6'];

export const getColorForTitle = (title: string): string => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

export const convertToCalendarEvent = (backendEvent: any): CalendarEvent => ({
  id: backendEvent.id,
  title: backendEvent.title,
  description: backendEvent.description,
  start: new Date(backendEvent.startDate),
  end: new Date(backendEvent.endDate),
  repetition: backendEvent.repetition,
  color: getColorForTitle(backendEvent.title),
});

export const convertToBackendEvent = (calendarEvent: CalendarEvent): any => ({
  id: calendarEvent.id,
  title: calendarEvent.title,
  description: calendarEvent.description,
  startDate: calendarEvent.start,
  endDate: calendarEvent.end,
  repetition: calendarEvent.repetition,
});

export const generateRecurringEvents = (event: CalendarEvent, start: Date, end: Date): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const interval = { start, end };

  switch (event.repetition) {
    case 'weekly':
      eachWeekOfInterval(interval).forEach(date => {
        events.push({ ...event, start: date, end: add(date, { hours: differenceInHours(event.end, event.start) }) });
      });
      break;
    case 'monthly':
      eachMonthOfInterval(interval).forEach(date => {
        events.push({ ...event, start: date, end: add(date, { hours: differenceInHours(event.end, event.start) }) });
      });
      break;
    case 'yearly':
      eachYearOfInterval(interval).forEach(date => {
        events.push({ ...event, start: date, end: add(date, { hours: differenceInHours(event.end, event.start) }) });
      });
      break;
    default:
      events.push(event);
      break;
  }

  return events;
};
