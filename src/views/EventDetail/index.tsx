import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import api from '../../utils/axios';
import { Events } from '../../utils/types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Events | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        // Handle error gracefully (e.g., display notification)
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (!event) {
    return <p>Cargando detalles del evento...</p>;
  }

  return (
    <Container className="mt-4 d-flex flex-column">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{event.title}</Card.Title>
          <Card.Text dangerouslySetInnerHTML={{ __html: event.description }} />
        </Card.Body>
      </Card>

      <Row>
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Fecha y Hora</Card.Title>
              <Card.Text>
                <span>Inicio:</span> {new Date(event.startDate).toLocaleString()}
              </Card.Text>
              <Card.Text>
                <span>Fin:</span> {new Date(event.endDate).toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <div className="calendar-container">
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
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetail;