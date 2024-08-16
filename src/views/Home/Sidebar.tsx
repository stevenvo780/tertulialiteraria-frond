import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import api from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/ui';
import { Events, Library } from '../../utils/types';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [latestNotes, setLatestNotes] = useState<Library[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Events[]>([]);

  useEffect(() => {
    fetchLatestNotes();
    fetchUpcomingEvents();
  }, []);

  const fetchLatestNotes = async () => {
    try {
      const response = await api.get<Library[]>('/library/home/latest?limit=5');
      setLatestNotes(response.data);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener las últimas notas', color: 'danger' }));
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await api.get<Events[]>('/events/home/upcoming?limit=5');
      setUpcomingEvents(response.data);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener los próximos eventos', color: 'danger' }));
    }
  };

  return (
    <div>
      <h4 className="mt-4">Próximos Eventos</h4>
      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => (
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

      <h4 className="mt-4">Últimas Notas</h4>
      {latestNotes.length > 0 ? (
        latestNotes.map((note) => (
          <Card className="mb-3" key={note.id}>
            <Card.Body>
              <Card.Title>{note.title}</Card.Title>
              <div
                style={{
                  maxHeight: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.overflow = 'auto';
                  target.style.whiteSpace = 'normal';
                  target.style.maxHeight = 'none';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.overflow = 'hidden';
                  target.style.whiteSpace = 'nowrap';
                  target.style.maxHeight = '100px';
                }}
                dangerouslySetInnerHTML={{ __html: note.description }}
              />
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No hay notas recientes</p>
      )}
    </div>
  );
};

export default Sidebar;
