import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import api from '../../utils/axios';
import { Events } from '../../utils/types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import { addNotification } from '../../redux/ui';
import { useDispatch } from 'react-redux';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Events | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        dispatch(addNotification({ message: 'Error al obtener el detalle del evento', color: 'danger' }));
      }
    };

    fetchEventDetails();
  }, [id, dispatch]);

  if (!event) {
    return <p>Cargando detalles del evento...</p>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{event.title}</Card.Title>
          <Card.Text dangerouslySetInnerHTML={{ __html: event.description }} />
          <Card.Text>
            Fecha de inicio: {new Date(event.startDate).toLocaleDateString()} - {new Date(event.startDate).toLocaleTimeString()}
          </Card.Text>
          <Card.Text>
            Fecha de fin: {new Date(event.endDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleTimeString()}
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Mostrar el evento en un calendario */}
      <div className="mt-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
          initialView="timeGridDay"
          events={[{
            title: event.title,
            start: event.startDate,
            end: event.endDate,
          }]}
          locale="es"
          headerToolbar={{
            left: '',
            center: 'title',
            right: ''
          }}
        />
      </div>
    </Container>
  );
};

export default EventDetail;
