import { Events, CalendarEvent } from '../utils/types';

export const convertToCalendarEvent = (event: Events) => ({
  id: event.id,
  title: event.title,
  description: event.description,
  start: event.startDate,
  end: event.endDate,
  repetition: event.repetition,
});


export const convertToBackendEvent = (calendarEvent: CalendarEvent): Events => ({
  id: calendarEvent.id,
  title: calendarEvent.title,
  description: calendarEvent.description,
  startDate: calendarEvent.start,
  endDate: calendarEvent.end,
  eventDate: calendarEvent.start,
  repetition: calendarEvent.repetition,
});