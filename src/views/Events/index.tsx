import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import api from '../../utils/axios';
import { addNotification } from '../../redux/ui';
import { useDispatch } from 'react-redux';

const localizer = momentLocalizer(moment);

interface MyEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
}

const EventsCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      dispatch(addNotification({ message: 'Error fetching events', color: 'danger' }));
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setEventDate(slotInfo.start);
    setShowModal(true);
  };

  const handleEventClick = (event: MyEvent) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setEventDate(new Date(event.start));
    setShowModal(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (selectedEvent) {
        await api.patch(`/events/${selectedEvent.id}`, { title, description, eventDate });
        dispatch(addNotification({ message: 'Event updated successfully', color: 'success' }));
      } else {
        await api.post('/events', { title, description, eventDate });
        dispatch(addNotification({ message: 'Event created successfully', color: 'success' }));
      }
      fetchEvents();
      setShowModal(false);
    } catch (error) {
      dispatch(addNotification({ message: 'Error saving event', color: 'danger' }));
    }
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      try {
        await api.delete(`/events/${selectedEvent.id}`);
        dispatch(addNotification({ message: 'Event deleted successfully', color: 'success' }));
        fetchEvents();
        setShowModal(false);
      } catch (error) {
        dispatch(addNotification({ message: 'Error deleting event', color: 'danger' }));
      }
    }
  };

  return (
    <Container fluid>
      <h2 className="my-4">Event Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Edit Event' : 'Create Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={eventDate ? eventDate.toISOString().substr(0, 10) : ''}
                onChange={(e) => setEventDate(new Date(e.target.value))}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {selectedEvent ? 'Update' : 'Create'}
            </Button>
            {selectedEvent && (
              <Button variant="danger" onClick={handleDelete} className="ml-2">
                Delete
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EventsCalendar;
