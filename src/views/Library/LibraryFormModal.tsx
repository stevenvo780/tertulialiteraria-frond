import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { Library, CreateLibraryDto, UpdateLibraryDto } from '../../utils/types';

interface LibraryFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (libraryData: CreateLibraryDto | UpdateLibraryDto) => void;
  editingLibrary: Library | null;
  libraries: Library[];
}

const LibraryFormModal: React.FC<LibraryFormModalProps> = ({
  show,
  onHide,
  onSubmit,
  editingLibrary,
  libraries,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>(''); // HTML Content
  const [parentNoteId, setParentNoteId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (editingLibrary) {
      setTitle(editingLibrary.title);
      setDescription(editingLibrary.description);
      setParentNoteId(editingLibrary.parent?.id || undefined);
    } else {
      setTitle('');
      setDescription('');
      setParentNoteId(undefined);
    }
  }, [editingLibrary]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const libraryData: CreateLibraryDto | UpdateLibraryDto = {
      title,
      description,
      referenceDate: editingLibrary ? editingLibrary.referenceDate : new Date(),
      parentNoteId: parentNoteId,
    };

    onSubmit(libraryData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{editingLibrary ? 'Editar Referencia' : 'Crear Referencia'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formLibraryTitle">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLibraryDescription">
            <Form.Label>Descripción</Form.Label>
            <Editor
              apiKey='ide9bzali9973f0fmbzusywuxlpp3mxmigqoa07eddfltlrj'
              value={description}
              init={{
                height: 300,
                menubar: false,
                plugins: 'link lists',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link',
              }}
              onEditorChange={(newContent: any) => setDescription(newContent)}
            />
          </Form.Group>
          <Form.Group controlId="formLibraryParentNote">
            <Form.Label>Subnota de</Form.Label>
            <Form.Control
              as="select"
              value={parentNoteId || ''}
              onChange={(e) => setParentNoteId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Ninguna</option>
              {libraries.filter((lib) => !lib.parent).map((lib) => (
                <option key={lib.id} value={lib.id}>{lib.title}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            {editingLibrary ? 'Actualizar' : 'Crear'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LibraryFormModal;
