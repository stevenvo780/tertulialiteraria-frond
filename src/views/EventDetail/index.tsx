import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import api from '../../utils/axios';
import { Events } from '../../utils/types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import EventModal from '../../components/EventModal';
import { FaEdit } from 'react-icons/fa';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Events | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
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

      {showModal && (
        <EventModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedEvent={event}
          fetchEvents={() => { }}
          isEditing={isEditing}
        />
      )}
    </Container>
  );
};

export default EventDetail;
