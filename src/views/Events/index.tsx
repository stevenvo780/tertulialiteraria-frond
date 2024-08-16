import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../redux/ui';
import { RootState } from '../../redux/store';
import { getEvents } from '../../redux/events';
import api from '../../utils/axios';
import { CalendarEvent } from '../../utils/types';
import EventModal from './EventModal';
import { generateRecurringEvents, convertToCalendarEvent } from './EventUtils';

const localizer = momentLocalizer(moment);

const EventsCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const eventsFromStore = useSelector((state: RootState) =>
    state.events.events.map(convertToCalendarEvent)
  );
  const userRole = useSelector((state: RootState) => state.auth.userData);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para verificar si se está editando

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
      setSelectedEvent({
        id: null,
        title: '',
        description: '',
        start: slotInfo.start,
        end: slotInfo.end,
        repetition: 'none',
        color: '',
      });
      setIsEditing(false); // Indicamos que no estamos editando
      setShowModal(true);
    } else {
      dispatch(addNotification({ message: 'No tienes permiso para crear eventos', color: 'warning' }));
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (userRole?.role === 'admin') {
      setSelectedEvent(event);
      setIsEditing(true); // Indicamos que estamos editando
      setShowModal(true);
    } else {
      dispatch(addNotification({ message: 'No tienes permiso para editar eventos', color: 'warning' }));
    }
  };

  const events = eventsFromStore.flatMap(event =>
    generateRecurringEvents(event, new Date(), moment().add(1, 'month').toDate())
  );

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
          style: { backgroundColor: event.color },
        })}
      />
      {showModal && (
        <EventModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          fetchEvents={fetchEvents}
          isEditing={isEditing} // Pasamos el estado de edición al modal
        />
      )}
    </Container>
  );
};

export default EventsCalendar;
