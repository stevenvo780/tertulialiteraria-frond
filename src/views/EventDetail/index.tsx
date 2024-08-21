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
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'react-share';
import './styles.css';

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
        const response = await api.get(`/events/home/upcoming?limit=3`);
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

  const shareUrl = window.location.href;
  const title = event ? event.title : "Evento";

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

          {/* Contador de Tiempo Restante */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Tiempo Restante</Card.Title>
              <Card.Text className="countdown-text">{timeRemaining}</Card.Text>
            </Card.Body>
          </Card>

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



          {/* Calendario Pequeño y Minimalista */}
          <Card className="mb-4">
            <Card.Body>
              <ReactCalendar
                value={new Date(event.startDate)}
                tileDisabled={({ date }) => date.getTime() !== new Date(event.startDate).getTime()}
                className="minimal-calendar"
                showNavigation={false} // Ocultar navegación
              />
            </Card.Body>
          </Card>

          {/* Botones de compartir en redes sociales organizados en un grid */}
          <div className="social-share-buttons d-flex flex-wrap justify-content-between mt-4">
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={60} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={60} round />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={title}>
              <WhatsappIcon size={60} round />
            </WhatsappShareButton>
            <LinkedinShareButton url={shareUrl} title={title}>
              <LinkedinIcon size={60} round />
            </LinkedinShareButton>
            <TelegramShareButton url={shareUrl} title={title}>
              <TelegramIcon size={60} round />
            </TelegramShareButton>
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
          fetchEvents={() => { }}
          isEditing={isEditing}
        />
      )}
    </Container>
  );
};

export default EventDetail;
