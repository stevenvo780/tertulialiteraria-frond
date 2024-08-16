import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Events } from '../../utils/types';
import EventForm from './EventForm';
import api from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent, deleteEvent } from '../../redux/events';
import { addNotification } from '../../redux/ui';

interface EventModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedEvent: Events | null;
  fetchEvents: () => void;
  isEditing: boolean; // Indicador de si se está editando o creando
}

const EventModal: React.FC<EventModalProps> = ({
  showModal,
  setShowModal,
  selectedEvent,
  fetchEvents,
  isEditing,
}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [repetition, setRepetition] = React.useState<string>('none');

  React.useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description);
      setStartDate(new Date(selectedEvent.startDate));
      setEndDate(new Date(selectedEvent.endDate));
      setRepetition(selectedEvent.repetition || 'none');
    }
  }, [selectedEvent]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (isEditing && selectedEvent && selectedEvent.id !== null) {
        const updatedEvent = {
          ...selectedEvent,
          title,
          description,
          startDate: startDate!,
          endDate: endDate!,
          repetition,
        };
        await api.patch(`/events/${selectedEvent.id}`, updatedEvent);
        dispatch(updateEvent(updatedEvent));
        dispatch(addNotification({ message: 'Evento actualizado correctamente', color: 'success' }));
      } else {
        const newEvent = {
          title,
          description,
          startDate: startDate!,
          endDate: endDate!,
          repetition,
        };
        console.log(newEvent);
        const response = await api.post('/events', newEvent);
        dispatch(addEvent(response.data));
        dispatch(addNotification({ message: 'Evento creado correctamente', color: 'success' }));
      }
      fetchEvents();
      setShowModal(false);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al guardar el evento', color: 'danger' }));
    }
  };

  const handleDelete = async () => {
    if (selectedEvent && selectedEvent.id !== null) {
      try {
        await api.delete(`/events/${selectedEvent.id}`);
        dispatch(deleteEvent(selectedEvent.id || 0));
        dispatch(addNotification({ message: 'Evento eliminado correctamente', color: 'success' }));
        fetchEvents();
        setShowModal(false);
      } catch (error) {
        dispatch(addNotification({ message: 'Error al eliminar el evento', color: 'danger' }));
      }
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Evento' : 'Crear Evento'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <EventForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            repetition={repetition}
            setRepetition={setRepetition}
          />
          <Button variant="primary" type="submit">
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
          {isEditing && selectedEvent && selectedEvent.id !== null && (
            <Button variant="danger" onClick={handleDelete} className="ml-2">
              Eliminar
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
