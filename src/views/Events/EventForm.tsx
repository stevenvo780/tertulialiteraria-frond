import React from 'react';
import { Form } from 'react-bootstrap';
import moment from 'moment';

interface EventFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  startDate: Date | null;
  setStartDate: (value: Date | null) => void;
  endDate: Date | null;
  setEndDate: (value: Date | null) => void;
  repetition: string;
  setRepetition: (value: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  repetition,
  setRepetition,
}) => {
  return (
    <>
      <Form.Group controlId="formEventTitle">
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formEventDescription">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formEventStartDate">
        <Form.Label>Fecha y Hora de Inicio</Form.Label>
        <Form.Control
          type="datetime-local"
          value={startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm') : ''}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          required
        />
      </Form.Group>
      <Form.Group controlId="formEventEndDate">
        <Form.Label>Fecha y Hora de Fin</Form.Label>
        <Form.Control
          type="datetime-local"
          value={endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm') : ''}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          required
        />
      </Form.Group>
      <Form.Group controlId="formEventRepetition">
        <Form.Label>Repetir Evento</Form.Label>
        <Form.Control
          as="select"
          value={repetition}
          onChange={(e) => setRepetition(e.target.value)}
        >
          <option value="none">No repetir</option>
          <option value="weekly">Semanalmente</option>
          <option value="monthly">Mensualmente</option>
          <option value="yearly">Anualmente</option>
        </Form.Control>
      </Form.Group>
    </>
  );
};

export default EventForm;
