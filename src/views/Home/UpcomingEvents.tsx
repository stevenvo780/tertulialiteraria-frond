import React from 'react';
import { Card } from 'react-bootstrap';
import { Events } from '../../utils/types';

interface UpcomingEventsProps {
  events: Events[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <div>
      <h4 className="mt-4">Próximos Eventos</h4>
      {events.length > 0 ? (
        events.map((event) => (
          <Card className="mb-3" key={event.id}>
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
