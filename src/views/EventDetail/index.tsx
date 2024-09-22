import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import api from '../../utils/axios';
import { Events } from '../../utils/types';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EventModal from '../../components/EventModal';
import ScrollableEvents from '../../components/ScrollableEvents';
import { FaEdit } from 'react-icons/fa';
import { getNextOccurrence } from '../Events/EventUtils';
import './styles.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserRole } from '../../utils/types';
import SocialShareButtons from '../../components/SocialShareButtons';
import moment from 'moment';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Events | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Events[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [nextOccurrence, setNextOccurrence] = useState<Date | null>(null);
  const userRole = useSelector((state: RootState) => state.auth.userData);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const eventData = response.data;
        eventData.startDate = moment.utc(eventData.startDate).local().toDate();
        eventData.endDate = moment.utc(eventData.endDate).local().toDate();
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    const fetchUpcomingEvents = async () => {
      try {
        const response = await api.get(`/events/home/upcoming?limit=31`);
        setUpcomingEvents(response.data);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    fetchEventDetails();
    fetchUpcomingEvents();
  }, [id]);

  useEffect(() => {
    if (event) {
      const next = getNextOccurrence(event);
      setNextOccurrence(next);
    }
  }, [event]);

  useEffect(() => {
    if (nextOccurrence) {
      const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const startTime = nextOccurrence.getTime();
        const timeDiff = startTime - now;

        if (timeDiff <= 0) {
          clearInterval(intervalId);
          setTimeRemaining('¡El evento ha comenzado!');
        } else {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [nextOccurrence]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowModal(true);
  };

  const shareUrl = window.location.href;
  const title = event ? event.title : "Evento";

  if (!event) {
    return <p>Cargando detalles del evento...</p>;
  }

  return (
    <Container className="mt-4 d-flex flex-column">
      {(userRole?.role === UserRole.ADMIN || userRole?.role === UserRole.SUPER_ADMIN) && (
        <div className="edit-icon-container position-fixed" style={{ top: '100px', right: '50px', zIndex:100 }}>
          <FaEdit
            size={24}
            onClick={handleEdit}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      <Row style={{ marginBottom: '20px' }}>
        {/* Detalles del Evento: Primero en dispositivos móviles */}
        <Col md={8} className="order-first order-md-last mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{event.title}</Card.Title>
              <Card.Text dangerouslySetInnerHTML={{ __html: event.description }} />
            </Card.Body>
          </Card>
        </Col>

        {/* Tarjetas: Último en dispositivos móviles */}
        <Col md={4} className="order-last order-md-first">
          <Card className="mb-4 gradient-card">
            <Card.Body>
              <Card.Text className="countdown-text">{timeRemaining || "00:00:00"}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Fecha</Card.Title>
              <Card.Text>{nextOccurrence ? nextOccurrence.toLocaleDateString() : 'Sin próxima fecha'}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Hora</Card.Title>
              <Card.Text>{nextOccurrence ? nextOccurrence.toLocaleTimeString() : 'Sin próxima hora'}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <ReactCalendar
                value={nextOccurrence || new Date(event.startDate)}
                tileDisabled={({ date }) => {
                  return false;
                }}
                className="minimal-calendar"
                showNavigation={false}
              />
            </Card.Body>
          </Card>

          <SocialShareButtons size={50} shareUrl={shareUrl} title={title} />
        </Col>
      </Row>
      {upcomingEvents.length > 0 && <ScrollableEvents events={upcomingEvents} />}

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
