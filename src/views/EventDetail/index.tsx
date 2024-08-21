import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import api from '../../utils/axios';
import { Events } from '../../utils/types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import EventModal from '../../components/EventModal';
import { FaEdit } from 'react-icons/fa';
import ScrollableEvents from '../../components/ScrollableEvents';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Events | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Events[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    const fetchUpcomingEvents = async () => {
      try {
        const response = await api.get(`/events/home/upcoming?limit=5`);
        setUpcomingEvents(response.data);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    fetchEventDetails();
    fetchUpcomingEvents();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowModal(true);
  };

  if (!event) {
    return <p>Cargando detalles del evento...</p>;
  }

  return (
    <Container className="mt-4 d-flex flex-column">
      <div className="edit-icon-container position-fixed" style={{ top: '100px', right: '50px' }}>
        <FaEdit 
          size={24} 
          onClick={handleEdit} 
          style={{ cursor: 'pointer' }} 
        />
      </div>
      <Row>
        <Col md={4}>
          {/* Tarjeta de Fecha */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Fecha</Card.Title>
              <Card.Text>{new Date(event.startDate).toLocaleDateString()}</Card.Text>
            </Card.Body>
          </Card>

          {/* Tarjeta de Hora */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Hora</Card.Title>
              <Card.Text>{new Date(event.startDate).toLocaleTimeString()}</Card.Text>
            </Card.Body>
          </Card>

          {/* Calendario Pequeño */}
          <Card>
            <Card.Body>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={[
                  {
                    title: event.title,
                    start: event.startDate,
                    end: event.endDate,
                    backgroundColor: '#f39c12',
                  },
                ]}
                headerToolbar={false}
                dayMaxEvents={true}
                eventClick={(info) => console.log('Event clicked:', info.event)}
                locale="es"
                height="auto"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          {/* Detalles del Evento */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{event.title}</Card.Title>
              <Card.Text dangerouslySetInnerHTML={{ __html: event.description }} />
            </Card.Body>
          </Card>

          {/* Otros detalles o contenido adicional */}
        </Col>
      </Row>

      {/* Scrollable Events al final de la página */}
      {upcomingEvents.length > 0 && <ScrollableEvents events={upcomingEvents} />}

      {showModal && (
        <EventModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedEvent={event}
          fetchEvents={() => {}}
          isEditing={isEditing}
        />
      )}
    </Container>
  );
};

export default EventDetail;
