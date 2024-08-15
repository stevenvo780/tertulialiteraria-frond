import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../redux/ui';
import { RootState } from '../../redux/store';
import api from '../../utils/axios';
import { getPublications, addPublication, updatePublication, deletePublication } from '../../redux/publications';

const PublicationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const publications = useSelector((state: RootState) => state.publications.publications);
  const [showModal, setShowModal] = useState(false);
  const [editingPublication, setEditingPublication] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await api.get('/publications');
      dispatch(getPublications(response.data));
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener las publicaciones', color: 'danger' }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingPublication) {
        const updatedPublication = { id: editingPublication.id, title, content, publicationDate: editingPublication.publicationDate };
        await api.patch(`/publications/${editingPublication.id}`, updatedPublication);
        dispatch(updatePublication(updatedPublication));
        dispatch(addNotification({ message: 'Publicación actualizada correctamente', color: 'success' }));
      } else {
        const newPublication = { title, content, publicationDate: new Date() };
        const response = await api.post('/publications', newPublication);
        dispatch(addPublication(response.data));
        dispatch(addNotification({ message: 'Publicación creada correctamente', color: 'success' }));
      }
      fetchPublications();
      setShowModal(false);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al guardar la publicación', color: 'danger' }));
    }
  };

  const handleEdit = (publication: any) => {
    setEditingPublication(publication);
    setTitle(publication.title);
    setContent(publication.content);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/publications/${id}`);
      dispatch(deletePublication(id));
      dispatch(addNotification({ message: 'Publicación eliminada correctamente', color: 'success' }));
    } catch (error) {
      dispatch(addNotification({ message: 'Error al eliminar la publicación', color: 'danger' }));
    }
  };

  return (
    <Container fluid>
      <h2 className="my-4">Publicaciones</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Crear Publicación
      </Button>
      <Row className="mt-4">
        {publications.map((publication: any) => (
          <Col md={4} key={publication.id}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{publication.title}</Card.Title>
                <Card.Text>{publication.content}</Card.Text>
                <Button variant="warning" onClick={() => handleEdit(publication)} className="mr-2">
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(publication.id)}>
                  Eliminar
                </Button>
              </Card.Body>
              <Card.Footer className="text-muted">Publicado el {new Date(publication.publicationDate).toLocaleDateString()}</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para crear/editar publicación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingPublication ? 'Editar Publicación' : 'Crear Publicación'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPublicationTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPublicationContent">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingPublication ? 'Actualizar' : 'Publicar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PublicationsPage;
