import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { TemplateType } from '../../utils/types';
import { Library, CreateLibraryDto, UpdateLibraryDto, LibraryVisibility } from '../../utils/types';
import CustomEditor from '../../components/CustomEditor';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserRole } from '../../utils/types';

interface LibraryFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (libraryData: CreateLibraryDto | UpdateLibraryDto) => void;
  editingLibrary: Library | null;
  showModal: boolean;
}

const LibraryFormModal: React.FC<LibraryFormModalProps> = ({
  show,
  onHide,
  onSubmit,
  editingLibrary,
  showModal,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [parentNoteId, setParentNoteId] = useState<number | undefined>(undefined);
  const [visibility, setVisibility] = useState<LibraryVisibility>(LibraryVisibility.GENERAL);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);

  useEffect(() => {
    if (editingLibrary) {
      setTitle(editingLibrary.title);
      setDescription(editingLibrary.description);
      setParentNoteId(editingLibrary.parent?.id || undefined);
      setVisibility(editingLibrary.visibility || LibraryVisibility.GENERAL);
    } else {
      setTitle('');
      setDescription('');
      setParentNoteId(undefined);
      setVisibility(LibraryVisibility.GENERAL);
    }
  }, [editingLibrary]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const libraryData: CreateLibraryDto | UpdateLibraryDto = {
      title,
      description,
      referenceDate: editingLibrary ? editingLibrary.referenceDate : new Date(),
      parentNoteId,
      visibility,
    };

    onSubmit(libraryData);
    onHide();
  };

  const editorRef = useRef<any>(null);

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onHide();
    if (editorRef.current) {
      editorRef.current.remove();
    }
  }

  return (
    <>
      {showModal && (
        <Modal show={show} onHide={onHide} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{editingLibrary ? 'Editar Referencia' : 'Crear Referencia'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => {
              handleSubmit(e);
              handleClose();
            }}>
              <Row>
                <Col md={userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN ? 6 : 12}>
                  <Form.Group controlId="formLibraryTitle">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                {(userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) && (
                  <Col md={6}>
                    <Form.Group controlId="formLibraryVisibility">
                      <Form.Label>Visibilidad</Form.Label>
                      <Form.Control
                        as="select"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value as LibraryVisibility)}
                        required
                      >
                        <option value={LibraryVisibility.GENERAL}>General</option>
                        <option value={LibraryVisibility.USERS}>Usuarios</option>
                        <option value={LibraryVisibility.ADMIN}>Admin</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                )}
              </Row>
              <br />
              <Form.Group controlId="formLibraryDescription">
                <Form.Label>Descripción</Form.Label>
                <CustomEditor
                  content={description}
                  setContent={setDescription}
                  templateType={TemplateType.NOTES}
                />
              </Form.Group>
              <br />
              <Button variant="primary" type="submit">
                {editingLibrary ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default LibraryFormModal;
