import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNotification } from '../../redux/ui';
import { RootState } from '../../redux/store';
import { getEvents } from '../../redux/events';
import api from '../../utils/axios';
import { Events, UserRole, Repetition } from '../../utils/types';
import EventModal from '../../components/EventModal';
import { generateRecurringEvents } from './EventUtils';
import "./styles.css";
import { EventInput } from '@fullcalendar/core';

const EventsCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const eventsFromStore = useSelector((state: RootState) => state.events.events);
  const userRole = useSelector((state: RootState) => state.auth.userData);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);

  const isMobile = window.innerWidth < 768;
  const initialView = isMobile ? 'timeGridWeek' : 'dayGridMonth';
  const calendarHeight = isMobile ? 'auto' : '700px';

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [showModal]);

  useEffect(() => {
    const generatedEvents = eventsFromStore.flatMap(generateRecurringEvents);
    setCalendarEvents(generatedEvents);
  }, [eventsFromStore]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      dispatch(getEvents(response.data));
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener los eventos', color: 'danger' }));
    }
  };

  const handleDateClick = (info: any) => {
    if (userRole?.role === UserRole.ADMIN || userRole?.role === UserRole.SUPER_ADMIN) {
      setSelectedEvent({
        id: null,
        title: '',
        description: '',
        startDate: info.date,
        endDate: info.date,
        eventDate: info.date,
        repetition: Repetition.NONE,
      });
      setIsEditing(false);
      setShowModal(true);
    } else {
      dispatch(addNotification({ message: 'No tienes permiso para crear eventos', color: 'warning' }));
    }
  };

  const handleEventClick = (info: any) => {
    const eventId = info.event.id.includes('-') ? info.event.id.split('-')[0] : info.event.id;
    navigate(`/events/${eventId}`);
  };

  return (
    <Container>
      <h2 className="my-4">Calendario de Eventos</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
        initialView={initialView} // Determina la vista inicial en función del dispositivo
        events={calendarEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true}
        locale="es"
        height={calendarHeight} // Ajusta la altura en función del dispositivo
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'today',
        }}
        footerToolbar={{
          left: 'dayGridMonth,timeGridWeek,timeGridDay',
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
          fetchEvents={fetchEvents}
          isEditing={isEditing}
        />
      )}
    </Container>
  );
};

export default EventsCalendar;
