import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import api from '../../utils/axios';
import { Events } from '../../utils/types';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EventModal from '../../components/EventModal';
import { FaEdit, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import ScrollableEvents from '../../components/ScrollableEvents';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Events | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Events[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

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

  useEffect(() => {
    if (event) {
      const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const startTime = new Date(event.startDate).getTime();
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
  }, [event]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowModal(true);
  };

  const shareOnSocialMedia = (platform: string) => {
    const url = window.location.href;
    const text = `¡Únete a este evento: ${event?.title}!`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'instagram':
        window.open(`https://www.instagram.com/`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      default:
        break;
    }
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

          {/* Contador de Tiempo Restante */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Tiempo Restante</Card.Title>
              <Card.Text>{timeRemaining}</Card.Text>
            </Card.Body>
          </Card>

          {/* Calendario Pequeño */}
          <Card className="mb-4">
            <Card.Body>
              <ReactCalendar
                value={new Date(event.startDate)}
                tileDisabled={({ date }) => date.getTime() !== new Date(event.startDate).getTime()}
              />
            </Card.Body>
          </Card>

          {/* Botones de compartir en redes sociales organizados en un grid */}
          <div className="social-share-buttons d-flex flex-wrap justify-content-between mt-4">
            <Button 
              variant="link" 
              className="p-0 mb-3" 
              onClick={() => shareOnSocialMedia('facebook')}
            >
              <FaFacebook size={28} />
            </Button>
            <Button 
              variant="link" 
              className="p-0 mb-3" 
              onClick={() => shareOnSocialMedia('twitter')}
            >
              <FaTwitter size={28} />
            </Button>
            <Button 
              variant="link" 
              className="p-0 mb-3" 
              onClick={() => shareOnSocialMedia('instagram')}
            >
              <FaInstagram size={28} />
            </Button>
            <Button 
              variant="link" 
              className="p-0 mb-3" 
              onClick={() => shareOnSocialMedia('whatsapp')}
            >
              <FaWhatsapp size={28} />
            </Button>
          </div>
        </Col>
        <Col md={8}>
          {/* Detalles del Evento */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{event.title}</Card.Title>
              <Card.Text dangerouslySetInnerHTML={{ __html: event.description }} />
            </Card.Body>
          </Card>
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
