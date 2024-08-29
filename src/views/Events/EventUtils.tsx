import { Events } from '../../utils/types';
import { add, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, differenceInHours, isAfter, isBefore } from 'date-fns';
import { EventInput } from '@fullcalendar/core';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A6'];

export const getColorForTitle = (title: string): string => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

export const convertToCalendarEvent = (event: Events): EventInput => ({
  id: event.id ? event.id.toString() : undefined,
  title: event.title,
  start: event.startDate,
  end: event.endDate,
  backgroundColor: getColorForTitle(event.title),
  extendedProps: {
    description: event.description,
    repetition: event.repetition,
    author: event.author,
  },
});

export const convertToBackendEvent = (calendarEvent: EventInput): Events => ({
  id: calendarEvent.id ? Number(calendarEvent.id) : null,
  title: calendarEvent.title || '',
  description: calendarEvent.extendedProps?.description || '',
  startDate: new Date(calendarEvent.start as string),
  endDate: calendarEvent.end ? new Date(calendarEvent.end as string) : new Date(calendarEvent.start as string),
  eventDate: new Date(calendarEvent.start as string),
  repetition: calendarEvent.extendedProps?.repetition,
});

export const generateRecurringEvents = (event: Events): EventInput[] => {
  const events: EventInput[] = [];
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  if (!event.repetition) {
    return [convertToCalendarEvent(event)];
  }

  let currentDate = startDate;
  let occurrenceIndex = 0; 

  while (isBefore(currentDate, add(startDate, { years: 1 }))) {
    events.push({
      id: event.id ? `${event.id}-${occurrenceIndex}` : undefined,
      title: event.title,
      start: currentDate.toISOString(),
      end: add(currentDate, { hours: differenceInHours(endDate, startDate) }).toISOString(),
      backgroundColor: getColorForTitle(event.title),
      extendedProps: {
        description: event.description,
        repetition: event.repetition,
        author: event.author,
      },
    });

    switch (event.repetition) {
      case 'weekly':
        currentDate = add(currentDate, { weeks: 1 });
        break;
      case 'monthly':
        currentDate = add(currentDate, { months: 1 });
        break;
      case 'yearly':
        currentDate = add(currentDate, { years: 1 });
        break;
      default:
        currentDate = add(currentDate, { years: 1 });
    }

    occurrenceIndex += 1;
  }

  return events;
};

export const getNextOccurrence = (event: Events): Date | null => {
  const now = new Date();
  const startDate = new Date(event.startDate);

  if (!event.repetition || isAfter(startDate, now)) {
    return startDate;
  }

  let nextDate = null;

  switch (event.repetition) {
    case 'weekly':
      nextDate = eachWeekOfInterval({ start: startDate, end: add(now, { months: 1 }) })
        .find(date => isAfter(date, now));
      break;
    case 'monthly':
      nextDate = eachMonthOfInterval({ start: startDate, end: add(now, { years: 1 }) })
        .find(date => isAfter(date, now));
      break;
    case 'yearly':
      nextDate = eachYearOfInterval({ start: startDate, end: add(now, { years: 5 }) })
        .find(date => isAfter(date, now));
      break;
    default:
      nextDate = startDate;
      break;
  }

  return nextDate || startDate;
};
