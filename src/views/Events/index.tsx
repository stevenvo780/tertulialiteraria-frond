import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../redux/ui';
import { RootState } from '../../redux/store';
import { getEvents } from '../../redux/events';
import api from '../../utils/axios';
import { Events } from '../../utils/types';
import EventModal from './EventModal';
import { convertToBackendEvent, generateRecurringEvents } from './EventUtils';

const EventsCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const eventsFromStore = useSelector((state: RootState) =>
    state.events.events.flatMap(generateRecurringEvents)
  );
  const userRole = useSelector((state: RootState) => state.auth.userData);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleDateClick = (info: any) => {
    if (userRole?.role === 'admin') {
      setSelectedEvent({
        id: null,
        title: '',
        description: '',
        startDate: new Date(info.dateStr),
        endDate: new Date(info.dateStr),
        eventDate: new Date(info.dateStr),
        repetition: 'none',
      });
      setIsEditing(false);
      setShowModal(true);
    } else {
      dispatch(addNotification({ message: 'No tienes permiso para crear eventos', color: 'warning' }));
    }
  };

  const handleEventClick = (info: any) => {
    if (userRole?.role === 'admin') {
      const clickedEvent = eventsFromStore.find(event => event.id === info.event.id);
      if (clickedEvent) {
        setSelectedEvent(convertToBackendEvent(clickedEvent));
        setIsEditing(true);
        setShowModal(true);
      }
    } else {
      dispatch(addNotification({ message: 'No tienes permiso para editar eventos', color: 'warning' }));
    }
  };

  return (
    <Container fluid>
      <h2 className="my-4">Calendario de Eventos</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
        initialView="dayGridMonth"
        events={eventsFromStore}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true}
        locale="es"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        buttonText={{
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día'
        }}
      />
      {showModal && (
        <EventModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          fetchEvents={fetchEvents}
          isEditing={isEditing}
        />
      )}
    </Container>
  );
};

export default EventsCalendar;
