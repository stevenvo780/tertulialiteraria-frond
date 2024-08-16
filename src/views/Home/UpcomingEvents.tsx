import React from 'react';
import { Card } from 'react-bootstrap';
import { Events } from '../../utils/types';
import { useNavigate } from 'react-router-dom';

interface UpcomingEventsProps {
  events: Events[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const navigate = useNavigate();

  const handleEventClick = (eventId: number | null) => {
    if (eventId !== null) {
      navigate(`/events/${eventId}`);
    }
  };

  return (
    <div>
      <h4 className="mt-4">Próximos Eventos</h4>
      {events.length > 0 ? (
        events.map((event) => (
          <Card
            className="mb-3"
            key={event.id}
            onClick={() => handleEventClick(event.id || 0)}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title>{event.title}</Card.Title>
              <Card.Text>
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.startDate).toLocaleTimeString()}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No hay eventos próximos</p>
      )}
    </div>
  );
};

export default UpcomingEvents;
