/* eslint-disable react-hooks/exhaustive-deps */
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
import { Events, Repetition, UserRole } from '../../utils/types';
import EventModal from '../../components/EventModal';
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

  useEffect(() => {
    fetchEvents();
  }, [showModal]);

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
    if (userRole?.role === UserRole.ADMIN || userRole?.role === UserRole.SUPER_ADMIN) {
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
    <Container>
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
          fetchEvents={fetchEvents}
          isEditing={isEditing}
        />
      )}
    </Container>
  );
};

export default EventsCalendar;
