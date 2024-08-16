import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../redux/ui';
import { RootState } from '../../redux/store';
import { getEvents, addEvent, updateEvent, deleteEvent } from '../../redux/events';
import api from '../../utils/axios';
import { CalendarEvent } from '../../utils/types';
import { add, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, differenceInHours } from 'date-fns';

const localizer = momentLocalizer(moment);

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A6'];

const getColorForTitle = (title: string): string => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

const convertToCalendarEvent = (backendEvent: any): CalendarEvent => ({
  id: backendEvent.id,
  title: backendEvent.title,
  description: backendEvent.description,
  start: new Date(backendEvent.startDate),
  end: new Date(backendEvent.endDate),
  repetition: backendEvent.repetition,
  color: getColorForTitle(backendEvent.title), // Asignar color basado en el título
});

const convertToBackendEvent = (calendarEvent: CalendarEvent): any => ({
  id: calendarEvent.id,
  title: calendarEvent.title,
  description: calendarEvent.description,
  startDate: calendarEvent.start,
  endDate: calendarEvent.end,
  repetition: calendarEvent.repetition,
});

const generateRecurringEvents = (event: CalendarEvent, start: Date, end: Date): CalendarEvent[] => {
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

const EventsCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const eventsFromStore = useSelector((state: RootState) => state.events.events.map(convertToCalendarEvent));
  const userRole = useSelector((state: RootState) => state.auth.userData);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [repetition, setRepetition] = useState<string>('none');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      dispatch(getEvents(response.data));
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener los eventos', color: 'danger' }));
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (userRole?.role === 'admin') {
      setStartDate(slotInfo.start);
      setEndDate(slotInfo.end);
      setShowModal(true);
    } else {
      dispatch(addNotification({ message: 'No tienes permiso para crear eventos', color: 'warning' }));
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (userRole?.role === 'admin') {
      setSelectedEvent(event);
      setTitle(event.title);
      setDescription(event.description);
      setStartDate(new Date(event.start));
      setEndDate(new Date(event.end));
      setRepetition(event.repetition || 'none');
      setShowModal(true);
    } else {
      dispatch(addNotification({ message: 'No tienes permiso para editar eventos', color: 'warning' }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (selectedEvent) {
        const updatedEvent = convertToBackendEvent({ 
          ...selectedEvent, 
          title, 
          description, 
          start: startDate!, 
          end: endDate!,
          repetition,
        });
        await api.patch(`/events/${selectedEvent.id}`, updatedEvent);
        dispatch(updateEvent(updatedEvent));
        dispatch(addNotification({ message: 'Evento actualizado correctamente', color: 'success' }));
      } else {
        const newEvent = convertToBackendEvent({
          title,
          description,
          start: startDate!,
          end: endDate!,
          repetition,
        });
        const response = await api.post('/events', newEvent);
        dispatch(addEvent(response.data));
        dispatch(addNotification({ message: 'Evento creado correctamente', color: 'success' }));
      }
      fetchEvents();
      setShowModal(false);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al guardar el evento', color: 'danger' }));
    }
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      try {
        await api.delete(`/events/${selectedEvent.id}`);
        dispatch(deleteEvent(selectedEvent.id as number));
        dispatch(addNotification({ message: 'Evento eliminado correctamente', color: 'success' }));
        fetchEvents();
        setShowModal(false);
      } catch (error) {
        dispatch(addNotification({ message: 'Error al eliminar el evento', color: 'danger' }));
      }
    }
  };

  const events = eventsFromStore.flatMap(event => {
    return generateRecurringEvents(event, new Date(), add(new Date(), { months: 1 }));
  });

  return (
    <Container fluid>
      <h2 className="my-4">Calendario de Eventos</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable={userRole?.role === 'admin'}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        eventPropGetter={(event) => ({
          style: { backgroundColor: event.color }, // Asignar color del evento
        })}
      />
      {showModal && (
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Editar Evento' : 'Crear Evento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEventDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEventStartDate">
              <Form.Label>Fecha y Hora de Inicio</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEventEndDate">
              <Form.Label>Fecha y Hora de Fin</Form.Label>
              <Form.Control
                type="datetime-local"
                value={endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEventRepetition">
              <Form.Label>Repetir Evento</Form.Label>
              <Form.Control
                as="select"
                value={repetition}
                onChange={(e) => setRepetition(e.target.value)}
              >
                <option value="none">No repetir</option>
                <option value="weekly">Semanalmente</option>
                <option value="monthly">Mensualmente</option>
                <option value="yearly">Anualmente</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              {selectedEvent ? 'Actualizar' : 'Crear'}
            </Button>
            {selectedEvent && (
              <Button variant="danger" onClick={handleDelete} className="ml-2">
                Eliminar
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
      )}
    </Container>
  );
};

export default EventsCalendar;
