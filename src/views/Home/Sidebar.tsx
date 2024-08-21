import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/ui';
import { Events, Library } from '../../utils/types';
import UpcomingEvents from './UpcomingEvents';
import LatestNotes from './LatestNotes';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [latestNotes, setLatestNotes] = useState<Library[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Events[]>([]);

  useEffect(() => {
    fetchLatestNotes();
    fetchUniqueEvents();
  }, []);

  const fetchLatestNotes = async () => {
    try {
      const response = await api.get<Library[]>('/library/home/latest?limit=3');
      setLatestNotes(response.data);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener las últimas notas', color: 'danger' }));
    }
  };

  const fetchUniqueEvents = async () => {
    try {
      const response = await api.get<Events[]>('/events/home/unique?limit=3');
      setUpcomingEvents(response.data);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener los próximos eventos', color: 'danger' }));
    }
  };

  return (
    <div>
      <UpcomingEvents events={upcomingEvents} />
      <LatestNotes notes={latestNotes} />
    </div>
  );
};

export default Sidebar;
