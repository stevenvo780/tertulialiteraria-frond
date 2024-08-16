import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { Events } from '../../utils/types';
import api from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent, deleteEvent } from '../../redux/events';
import { addNotification } from '../../redux/ui';
import { storage } from '../../utils/firebase';

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [repetition, setRepetition] = useState<string>('none');
  const editorRef = useRef<any>(null);

  useEffect(() => {
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

  const uploadImage = async (blobInfo: any): Promise<string> => {
    try {
      const file = blobInfo.blob();
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`images/${file.name}`);

      const uploadTaskSnapshot = await fileRef.put(file);
      const fileUrl = await uploadTaskSnapshot.ref.getDownloadURL();
      return fileUrl;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw new Error("Error al subir la imagen");
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStartDate(null);
    setEndDate(null);
    setRepetition('none');
    setShowModal(false);
    if (editorRef.current) {
      editorRef.current.remove(); // Desmonta manualmente el editor
    }
  }

  return (
    <Modal show={showModal} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Evento' : 'Crear Evento'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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
            <Editor
              apiKey='ide9bzali9973f0fmbzusywuxlpp3mxmigqoa07eddfltlrj'
              value={description}
              onInit={(evt, editor) => editorRef.current = editor}
              init={{
                advcode_inline: true,
                height: 500,
                menubar: false,
                plugins: 'powerpaste casechange searchreplace autolink directionality visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export autosave advcode fullscreen',
                toolbar: "undo redo spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image | alignleft aligncenter alignright alignjustify | code",
                images_upload_handler: uploadImage,
              }}
              onEditorChange={(newContent: any) => setDescription(newContent)}
            />
          </Form.Group>
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
