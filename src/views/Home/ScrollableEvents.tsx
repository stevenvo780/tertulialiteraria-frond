import React, { useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Events } from '../../utils/types';
import { useNavigate } from 'react-router-dom';

interface ScrollableEventsProps {
  events: Events[];
}

const ScrollableEvents: React.FC<ScrollableEventsProps> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const handleEventClick = (eventId: number | null) => {
    if (eventId !== null) {
      navigate(`/events/${eventId}`);
    }
  };

  return (
    <div className="d-flex align-items-center my-4">
      <Button variant="outline-primary" onClick={() => handleScroll('left')}>
        <FaChevronLeft />
      </Button>
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          marginLeft: 20,
          marginRight: 20,
          width: '80%',
          scrollbarWidth: 'none',
        }}
        className="no-scrollbar"
      >
        {events.length > 0 ? (
          events.map((event) => (
            <Card
              key={event.id}
              style={{ minWidth: '200px', marginRight: '10px', cursor: 'pointer' }}
              onClick={() => handleEventClick(event.id as number | null)}
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
          <p>No hay eventos repetitivos</p>
        )}
      </div>
      <Button variant="outline-primary" onClick={() => handleScroll('right')}>
        <FaChevronRight />
      </Button>
    </div>
  );
};

export default ScrollableEvents;
